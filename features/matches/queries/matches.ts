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

export async function getMatchForParticipant(actorId: string, matchId: string): Promise<MatchView | null> {
  if (!Types.ObjectId.isValid(matchId)) return null;
  await connectToDatabase();
  const match = await MatchModel.findOne({ _id: new Types.ObjectId(matchId), participantIds: new Types.ObjectId(actorId) })
    .select({ rivalryId: 1, participantIds: 1, scores: 1, game: 1, customGameLabel: 1, submittedBy: 1, status: 1, playedAt: 1, createdAt: 1 })
    .lean<MatchRecord>().exec();
  return match ? toMatchView(match) : null;
}
