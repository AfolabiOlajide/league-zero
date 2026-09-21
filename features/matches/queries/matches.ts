import "server-only";

import { Types } from "mongoose";

import type { MatchGame, MatchStatus, MatchView } from "@/features/matches/types";
import { connectToDatabase } from "@/lib/db/connect";
import { MatchModel } from "@/models/match";

type MatchRecord = {
  _id: Types.ObjectId; rivalryId: Types.ObjectId; participantIds: Types.ObjectId[]; scores: number[];
  game: MatchGame; customGameLabel?: string; submittedBy: Types.ObjectId; status: MatchStatus; playedAt: Date; createdAt: Date;
};

function toMatchView(match: MatchRecord): MatchView {
  return { id: match._id.toString(), rivalryId: match.rivalryId.toString(), participantIds: [match.participantIds[0].toString(), match.participantIds[1].toString()], scores: [match.scores[0], match.scores[1]], game: match.game, customGameLabel: match.customGameLabel, submittedBy: match.submittedBy.toString(), status: match.status, playedAt: match.playedAt.toISOString(), createdAt: match.createdAt.toISOString() };
}

export async function getRivalryMatches(actorId: string, rivalryId: string): Promise<MatchView[]> {
  if (!Types.ObjectId.isValid(rivalryId)) return [];
  await connectToDatabase();
  const matches = await MatchModel.find({ rivalryId: new Types.ObjectId(rivalryId), participantIds: new Types.ObjectId(actorId) })
    .select({ rivalryId: 1, participantIds: 1, scores: 1, game: 1, customGameLabel: 1, submittedBy: 1, status: 1, playedAt: 1, createdAt: 1 })
    .sort({ playedAt: -1, createdAt: -1 }).lean<MatchRecord[]>().exec();
  return matches.map(toMatchView);
}

export type HistoryFilter = "all" | "confirmed" | "pending" | "rejected";
export type RivalryHistory = { matches: MatchView[]; total: number; page: number; totalPages: number };

const filterStatuses: Record<HistoryFilter, MatchStatus[] | undefined> = {
  all: undefined, confirmed: ["accepted"], pending: ["pending"], rejected: ["rejected"],
};

export async function getRivalryHistory(
  actorId: string, rivalryId: string, filter: HistoryFilter, requestedPage: number,
): Promise<RivalryHistory> {
  if (!Types.ObjectId.isValid(rivalryId)) return { matches: [], total: 0, page: 1, totalPages: 1 };
  await connectToDatabase();
  const query = { rivalryId: new Types.ObjectId(rivalryId), participantIds: new Types.ObjectId(actorId), ...(filterStatuses[filter] ? { status: { $in: filterStatuses[filter] } } : {}) };
  const total = await MatchModel.countDocuments(query).exec();
  const totalPages = Math.max(1, Math.ceil(total / 20));
  const page = Math.min(Math.max(1, requestedPage), totalPages);
  const matches = await MatchModel.find(query).select({ rivalryId: 1, participantIds: 1, scores: 1, game: 1, customGameLabel: 1, submittedBy: 1, status: 1, playedAt: 1, createdAt: 1 })
    .sort({ playedAt: -1, createdAt: -1, _id: -1 }).skip((page - 1) * 20).limit(20).lean<MatchRecord[]>().exec();
  return { matches: matches.map(toMatchView), total, page, totalPages };
}

export async function getAcceptedRivalryMatches(actorId: string, rivalryId: string): Promise<MatchView[]> {
  if (!Types.ObjectId.isValid(rivalryId)) return [];
  await connectToDatabase();
  const matches = await MatchModel.find({ rivalryId: new Types.ObjectId(rivalryId), participantIds: new Types.ObjectId(actorId), status: "accepted" })
    .select({ rivalryId: 1, participantIds: 1, scores: 1, game: 1, customGameLabel: 1, submittedBy: 1, status: 1, playedAt: 1, createdAt: 1 })
    .lean<MatchRecord[]>().exec();
  return matches.map(toMatchView);
}

export async function getRecentAcceptedMatchesForUser(
  actorId: string,
  limit = 1000,
): Promise<MatchView[]> {
  await connectToDatabase();

  const matches = await MatchModel.find({
    participantIds: new Types.ObjectId(actorId),
    status: "accepted",
  })
    .select({ rivalryId: 1, participantIds: 1, scores: 1, game: 1, customGameLabel: 1, submittedBy: 1, status: 1, playedAt: 1, createdAt: 1 })
    .sort({ playedAt: -1, createdAt: -1, _id: -1 })
    .limit(limit)
    .lean<MatchRecord[]>()
    .exec();

  return matches.map(toMatchView);
}

export async function getMatchForParticipant(actorId: string, matchId: string): Promise<MatchView | null> {
  if (!Types.ObjectId.isValid(matchId)) return null;
  await connectToDatabase();
  const match = await MatchModel.findOne({ _id: new Types.ObjectId(matchId), participantIds: new Types.ObjectId(actorId) })
    .select({ rivalryId: 1, participantIds: 1, scores: 1, game: 1, customGameLabel: 1, submittedBy: 1, status: 1, playedAt: 1, createdAt: 1 })
    .lean<MatchRecord>().exec();
  return match ? toMatchView(match) : null;
}
