"use server";

import { revalidatePath } from "next/cache";
import { startSession, Types } from "mongoose";

import { alignScores, canDecideMatch } from "@/features/matches/authorization";
import { acceptAllPendingMatchesSchema, createMatchSchema, decideMatchSchema, updateMatchSchema } from "@/features/matches/schemas/match";
import type { MatchActionState } from "@/features/matches/types";
import { getCurrentAppUser } from "@/lib/auth/get-current-app-user";
import { connectToDatabase } from "@/lib/db/connect";
import { MatchModel } from "@/models/match";
import { NotificationModel } from "@/models/notification";
import { RivalryModel } from "@/models/rivalry";

function failed(message: string, fieldErrors?: Record<string, string[]>): MatchActionState { return { status: "error", message, fieldErrors }; }
function isDuplicateKeyError(error: unknown) { return typeof error === "object" && error !== null && "code" in error && error.code === 11000; }
function playedAt(value: string) { return new Date(`${value}T12:00:00.000Z`); }
function paths(rivalryId: string, matchId?: string) { revalidatePath(`/rivalries/${rivalryId}`); revalidatePath("/notifications"); if (matchId) revalidatePath(`/matches/${matchId}`); }

export async function submitMatch(_previous: MatchActionState, formData: FormData): Promise<MatchActionState> {
  const actor = await getCurrentAppUser();
  if (!actor) return failed("Your session expired. Sign in again to log a result.");
  const parsed = createMatchSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return failed("Check the highlighted fields and try again.", parsed.error.flatten().fieldErrors);

  await connectToDatabase();
  const rivalry = await RivalryModel.findOne({ _id: new Types.ObjectId(parsed.data.rivalryId), status: "active", participantIds: new Types.ObjectId(actor.id) })
    .select({ participantIds: 1 }).lean<{ _id: Types.ObjectId; participantIds: Types.ObjectId[] }>().exec();
  if (!rivalry) return failed("Only active rivalry participants can log a match.");

  const participantIds = rivalry.participantIds.map((id) => id.toString());
  const scores = alignScores(participantIds, actor.id, parsed.data.myScore, parsed.data.opponentScore);
  const opponentId = participantIds.find((id) => id !== actor.id);
  if (!opponentId) return failed("This rivalry is incomplete. Refresh and try again.");
  const session = await startSession();
  let matchId: string | undefined;
  try {
    await session.withTransaction(async () => {
      const [match] = await MatchModel.create([{
        rivalryId: rivalry._id, participantIds: rivalry.participantIds, scores, game: parsed.data.game,
        customGameLabel: parsed.data.game === "other" ? parsed.data.customGameLabel : undefined,
        submittedBy: new Types.ObjectId(actor.id), status: "pending", playedAt: playedAt(parsed.data.playedAt), idempotencyKey: parsed.data.idempotencyKey,
      }], { session });
      matchId = match._id.toString();
      await NotificationModel.create([{ recipientId: new Types.ObjectId(opponentId), actorId: new Types.ObjectId(actor.id), type: "match_submitted", entityType: "match", entityId: match._id }], { session });
    });
  } catch (error) {
    if (!isDuplicateKeyError(error)) return failed("We could not log this result. Try again in a moment.");
    const existing = await MatchModel.findOne({ rivalryId: rivalry._id, submittedBy: new Types.ObjectId(actor.id), idempotencyKey: parsed.data.idempotencyKey }).select({ _id: 1 }).lean<{ _id: Types.ObjectId }>().exec();
    if (!existing) return failed("We could not verify the previous submission. Refresh and try again.");
    matchId = existing._id.toString();
  } finally { await session.endSession(); }
  paths(parsed.data.rivalryId, matchId);
  return { status: "success", message: "Result submitted for your opponent to verify.", matchId };
}

export async function updatePendingMatch(_previous: MatchActionState, formData: FormData): Promise<MatchActionState> {
  const actor = await getCurrentAppUser();
  if (!actor) return failed("Your session expired. Sign in again to edit this result.");
  const parsed = updateMatchSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return failed("Check the highlighted fields and try again.", parsed.error.flatten().fieldErrors);
  await connectToDatabase();
  const match = await MatchModel.findOne({ _id: new Types.ObjectId(parsed.data.matchId), status: "pending", submittedBy: new Types.ObjectId(actor.id), participantIds: new Types.ObjectId(actor.id) })
    .select({ _id: 1, rivalryId: 1, participantIds: 1 }).lean<{ _id: Types.ObjectId; rivalryId: Types.ObjectId; participantIds: Types.ObjectId[] }>().exec();
  if (!match) return failed("Only your own pending result can be edited.");
  const scores = alignScores(match.participantIds.map((id) => id.toString()), actor.id, parsed.data.myScore, parsed.data.opponentScore);
  const result = await MatchModel.updateOne({ _id: match._id, status: "pending", submittedBy: new Types.ObjectId(actor.id) }, { $set: { scores, game: parsed.data.game, customGameLabel: parsed.data.game === "other" ? parsed.data.customGameLabel : undefined, playedAt: playedAt(parsed.data.playedAt) } }).exec();
  if (result.modifiedCount !== 1) return failed("This result changed before it could be edited. Refresh and try again.");
  const rivalryId = match.rivalryId.toString(); paths(rivalryId, match._id.toString());
  return { status: "success", message: "Pending result updated.", matchId: match._id.toString() };
}

async function decideMatch(formData: FormData, status: "accepted" | "rejected"): Promise<MatchActionState> {
  const actor = await getCurrentAppUser();
  if (!actor) return failed("Your session expired. Sign in again to decide this result.");
  const parsed = decideMatchSchema.safeParse({ matchId: formData.get("matchId") });
  if (!parsed.success) return failed(parsed.error.issues[0]?.message ?? "Refresh and try again.");
  await connectToDatabase();
  const match = await MatchModel.findOne({ _id: new Types.ObjectId(parsed.data.matchId), participantIds: new Types.ObjectId(actor.id) })
    .select({ rivalryId: 1, participantIds: 1, submittedBy: 1, status: 1 }).lean<{ _id: Types.ObjectId; rivalryId: Types.ObjectId; participantIds: Types.ObjectId[]; submittedBy: Types.ObjectId; status: string }>().exec();
  if (!match || !canDecideMatch(match.participantIds.map((id) => id.toString()), match.submittedBy.toString(), actor.id)) return failed("Only the opponent can decide this pending result.");
  const session = await startSession();
  try {
    await session.withTransaction(async () => {
      const updated = await MatchModel.findOneAndUpdate({ _id: match._id, status: "pending", submittedBy: { $ne: new Types.ObjectId(actor.id) } }, { $set: status === "accepted" ? { status, acceptedAt: new Date() } : { status, rejectedAt: new Date() } }, { new: true, session }).exec();
      if (!updated) throw new Error("STALE_MATCH");
      await NotificationModel.create([{ recipientId: match.submittedBy, actorId: new Types.ObjectId(actor.id), type: status === "accepted" ? "match_accepted" : "match_rejected", entityType: "match", entityId: match._id }], { session });
    });
  } catch { return failed("This result changed before your decision. Refresh and try again."); } finally { await session.endSession(); }
  paths(match.rivalryId.toString(), match._id.toString());
  return { status: "success", message: status === "accepted" ? "Result confirmed and added to the official record." : "Result rejected. It will not affect the official record.", matchId: match._id.toString() };
}

export async function acceptMatch(_previous: MatchActionState, formData: FormData) { return decideMatch(formData, "accepted"); }
export async function rejectMatch(_previous: MatchActionState, formData: FormData) { return decideMatch(formData, "rejected"); }

export async function acceptAllPendingMatches(_previous: MatchActionState, formData: FormData): Promise<MatchActionState> {
  const actor = await getCurrentAppUser();
  if (!actor) return failed("Your session expired. Sign in again to decide these results.");
  const parsed = acceptAllPendingMatchesSchema.safeParse({ rivalryId: formData.get("rivalryId") });
  if (!parsed.success) return failed(parsed.error.issues[0]?.message ?? "Refresh and try again.");
  await connectToDatabase();
  const rivalry = await RivalryModel.findOne({
    _id: new Types.ObjectId(parsed.data.rivalryId),
    status: "active",
    participantIds: new Types.ObjectId(actor.id),
  }).select({ _id: 1, participantIds: 1 }).lean<{ _id: Types.ObjectId; participantIds: Types.ObjectId[] }>().exec();
  if (!rivalry) return failed("Only active rivalry participants can decide results.");

  const pendingMatches = await MatchModel.find({
    rivalryId: rivalry._id,
    participantIds: new Types.ObjectId(actor.id),
    status: "pending",
    submittedBy: { $ne: new Types.ObjectId(actor.id) },
  }).select({ _id: 1, submittedBy: 1 }).lean<Array<{ _id: Types.ObjectId; submittedBy: Types.ObjectId }>>().exec();

  if (pendingMatches.length === 0) {
    return failed("There are no pending results awaiting your decision.");
  }

  const matchIds = pendingMatches.map((m) => m._id);
  const session = await startSession();
  try {
    await session.withTransaction(async () => {
      const now = new Date();
      await MatchModel.updateMany(
        {
          _id: { $in: matchIds },
          status: "pending",
          submittedBy: { $ne: new Types.ObjectId(actor.id) },
        },
        { $set: { status: "accepted", acceptedAt: now } },
        { session },
      );
      const notifications = pendingMatches.map((match) => ({
        recipientId: match.submittedBy,
        actorId: new Types.ObjectId(actor.id),
        type: "match_accepted" as const,
        entityType: "match" as const,
        entityId: match._id,
      }));
      await NotificationModel.create(notifications, { session, ordered: true });
    });
  } catch (error) {
    console.error("acceptAllPendingMatches error:", error);
    const detail = error instanceof Error ? error.message : "We could not confirm these results. Refresh and try again.";
    return failed(detail);
  } finally {
    await session.endSession();
  }

  paths(parsed.data.rivalryId);
  for (const match of pendingMatches) {
    revalidatePath(`/matches/${match._id.toString()}`);
  }
  const count = pendingMatches.length;
  return {
    status: "success",
    message: `${count} pending result${count > 1 ? "s" : ""} confirmed and added to the official record.`,
  };
}
