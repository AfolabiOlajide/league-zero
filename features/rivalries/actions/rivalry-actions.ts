"use server";

import { revalidatePath } from "next/cache";
import { startSession, Types } from "mongoose";

import { createPairKey, isRivalryRecipient } from "@/features/rivalries/pair";
import {
  createRivalrySchema,
  rivalryDecisionSchema,
} from "@/features/rivalries/schemas/rivalry";
import { getCurrentAppUser } from "@/lib/auth/get-current-app-user";
import { connectToDatabase } from "@/lib/db/connect";
import { NotificationModel } from "@/models/notification";
import { RivalryModel } from "@/models/rivalry";
import { UserModel } from "@/models/user";

export type RivalryActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export const initialRivalryActionState: RivalryActionState = { status: "idle" };

function isDuplicateKeyError(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === 11000;
}

function invalidState(message = "This request changed before your decision. Refresh and try again.") {
  return { status: "error" as const, message };
}

export async function requestRivalry(
  _previousState: RivalryActionState,
  formData: FormData,
): Promise<RivalryActionState> {
  const actor = await getCurrentAppUser();
  if (!actor) return invalidState("Your session expired. Sign in again to send a request.");

  const parsed = createRivalrySchema.safeParse({ targetUserId: formData.get("targetUserId") });
  if (!parsed.success) return invalidState(parsed.error.issues[0]?.message);
  if (parsed.data.targetUserId === actor.id) return invalidState("You cannot send a rivalry request to yourself.");

  await connectToDatabase();
  const targetId = new Types.ObjectId(parsed.data.targetUserId);
  const target = await UserModel.exists({ _id: targetId });
  if (!target) return invalidState("That player is no longer available. Search again.");

  const pairKey = createPairKey(actor.id, parsed.data.targetUserId);
  const participantIds = pairKey.split(":").map((id) => new Types.ObjectId(id));
  const session = await startSession();
  try {
    await session.withTransaction(async () => {
      const existing = await RivalryModel.findOne({ pairKey }).session(session).exec();
      if (existing?.status === "active") throw new Error("ACTIVE_RIVALRY");
      if (existing?.status === "pending") throw new Error("PENDING_RIVALRY");

      let rivalryId: Types.ObjectId;
      if (existing) {
        const renewed = await RivalryModel.findOneAndUpdate(
          { _id: existing._id, status: { $in: ["rejected", "cancelled"] } },
          {
            $set: { status: "pending", requestedBy: new Types.ObjectId(actor.id) },
            $unset: { acceptedAt: 1, rejectedAt: 1, cancelledAt: 1 },
          },
          { new: true, session },
        ).exec();
        if (!renewed) throw new Error("STALE_RIVALRY");
        rivalryId = renewed._id;
      } else {
        const [created] = await RivalryModel.create(
          [{ participantIds, pairKey, requestedBy: new Types.ObjectId(actor.id), status: "pending" }],
          { session },
        );
        rivalryId = created._id;
      }

      await NotificationModel.create([
        {
          recipientId: targetId,
          actorId: new Types.ObjectId(actor.id),
          type: "rivalry_requested",
          entityType: "rivalry",
          entityId: rivalryId,
        },
      ], { session });
    });
  } catch (error) {
    if (isDuplicateKeyError(error)) return invalidState("A request already exists for this player. Refresh to see its status.");
    if (error instanceof Error && error.message === "ACTIVE_RIVALRY") return invalidState("You already have an active rivalry with this player.");
    if (error instanceof Error && error.message === "PENDING_RIVALRY") return invalidState("A rivalry request is already awaiting a decision.");
    return invalidState();
  } finally {
    await session.endSession();
  }

  revalidatePath("/search");
  revalidatePath("/rivalries");
  revalidatePath("/notifications");
  return { status: "success", message: "Rivalry request sent. They can decide it from their Rivalries page." };
}

async function decideRivalry(
  formData: FormData,
  decision: "active" | "rejected",
): Promise<RivalryActionState> {
  const actor = await getCurrentAppUser();
  if (!actor) return invalidState("Your session expired. Sign in again to decide this request.");
  const parsed = rivalryDecisionSchema.safeParse({ rivalryId: formData.get("rivalryId") });
  if (!parsed.success) return invalidState(parsed.error.issues[0]?.message);

  await connectToDatabase();
  const rivalry = await RivalryModel.findById(parsed.data.rivalryId)
    .select({ participantIds: 1, requestedBy: 1, status: 1 })
    .lean<{ _id: Types.ObjectId; participantIds: Types.ObjectId[]; requestedBy: Types.ObjectId; status: string }>()
    .exec();
  if (!rivalry) return invalidState("This rivalry request is no longer available.");

  const participantIds = rivalry.participantIds.map((id) => id.toString());
  if (!isRivalryRecipient(participantIds, rivalry.requestedBy.toString(), actor.id)) {
    return invalidState("Only the player who received this request can decide it.");
  }

  const now = new Date();
  const update = decision === "active"
    ? { $set: { status: "active", acceptedAt: now }, $unset: { rejectedAt: 1, cancelledAt: 1 } }
    : { $set: { status: "rejected", rejectedAt: now }, $unset: { acceptedAt: 1, cancelledAt: 1 } };
  const notificationType = decision === "active" ? "rivalry_accepted" : "rivalry_rejected";
  const session = await startSession();
  try {
    await session.withTransaction(async () => {
      const updated = await RivalryModel.findOneAndUpdate(
        { _id: rivalry._id, status: "pending", requestedBy: { $ne: new Types.ObjectId(actor.id) } },
        update,
        { new: true, session },
      ).exec();
      if (!updated) throw new Error("STALE_RIVALRY");
      await NotificationModel.create([{
        recipientId: rivalry.requestedBy,
        actorId: new Types.ObjectId(actor.id),
        type: notificationType,
        entityType: "rivalry",
        entityId: rivalry._id,
      }], { session });
    });
  } catch {
    return invalidState();
  } finally {
    await session.endSession();
  }

  revalidatePath("/rivalries");
  revalidatePath(`/rivalries/${parsed.data.rivalryId}`);
  revalidatePath("/notifications");
  return { status: "success", message: decision === "active" ? "Rivalry accepted. Your shared record is ready." : "Rivalry request rejected." };
}

export async function acceptRivalry(
  _previousState: RivalryActionState,
  formData: FormData,
) {
  return decideRivalry(formData, "active");
}

export async function rejectRivalry(
  _previousState: RivalryActionState,
  formData: FormData,
) {
  return decideRivalry(formData, "rejected");
}

export async function cancelRivalry(
  _previousState: RivalryActionState,
  formData: FormData,
): Promise<RivalryActionState> {
  const actor = await getCurrentAppUser();
  if (!actor) return invalidState("Your session expired. Sign in again to cancel this request.");
  const parsed = rivalryDecisionSchema.safeParse({ rivalryId: formData.get("rivalryId") });
  if (!parsed.success) return invalidState(parsed.error.issues[0]?.message);

  await connectToDatabase();
  const result = await RivalryModel.updateOne(
    { _id: new Types.ObjectId(parsed.data.rivalryId), status: "pending", requestedBy: new Types.ObjectId(actor.id) },
    { $set: { status: "cancelled", cancelledAt: new Date() } },
  ).exec();
  if (result.modifiedCount !== 1) return invalidState("Only the requester can cancel a request that is still pending.");

  revalidatePath("/rivalries");
  revalidatePath(`/rivalries/${parsed.data.rivalryId}`);
  revalidatePath("/search");
  return { status: "success", message: "Rivalry request cancelled." };
}
