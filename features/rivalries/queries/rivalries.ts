import "server-only";

import { Types } from "mongoose";

import { createPairKey } from "@/features/rivalries/pair";
import type {
  RivalryDetail,
  RivalryParticipant,
  RivalryStatus,
  RivalrySummary,
  SearchUserResult,
} from "@/features/rivalries/types";
import { normalizeUsername } from "@/features/users/username";
import { connectToDatabase } from "@/lib/db/connect";
import { RivalryModel } from "@/models/rivalry";
import { UserModel } from "@/models/user";

type UserRecord = {
  _id: Types.ObjectId;
  username: string;
  displayName: string;
  avatarUrl?: string;
};

type RivalryRecord = {
  _id: Types.ObjectId;
  participantIds: Types.ObjectId[];
  requestedBy: Types.ObjectId;
  status: RivalryStatus;
  createdAt: Date;
  updatedAt: Date;
};

function toParticipant(user: UserRecord): RivalryParticipant {
  return {
    id: user._id.toString(),
    username: user.username,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl,
  };
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function searchUsersByUsername(
  actorId: string,
  rawQuery: string,
): Promise<SearchUserResult[]> {
  const query = normalizeUsername(rawQuery);
  if (!query) return [];

  await connectToDatabase();

  const users = await UserModel.find({
    _id: { $ne: new Types.ObjectId(actorId) },
    username: { $regex: `^${escapeRegex(query)}`, $options: "i" },
  })
    .select({ username: 1, displayName: 1, avatarUrl: 1 })
    .sort({ username: 1 })
    .limit(8)
    .lean<UserRecord[]>()
    .exec();

  if (users.length === 0) return [];

  const pairKeys = users.map((user) => createPairKey(actorId, user._id.toString()));
  const rivalries = await RivalryModel.find({ pairKey: { $in: pairKeys } })
    .select({ pairKey: 1, status: 1, requestedBy: 1 })
    .lean<Array<{ _id: Types.ObjectId; pairKey: string; status: RivalryStatus; requestedBy: Types.ObjectId }>>()
    .exec();
  const rivalryByPair = new Map(rivalries.map((rivalry) => [rivalry.pairKey, rivalry]));

  return users.map((user) => {
    const rivalry = rivalryByPair.get(createPairKey(actorId, user._id.toString()));
    return {
      ...toParticipant(user),
      rivalry: rivalry
        ? { id: rivalry._id.toString(), status: rivalry.status, requestedBy: rivalry.requestedBy.toString() }
        : undefined,
    };
  });
}

export async function getRivalriesForUser(actorId: string): Promise<RivalrySummary[]> {
  await connectToDatabase();

  const rivalries = await RivalryModel.find({ participantIds: new Types.ObjectId(actorId) })
    .select({ participantIds: 1, requestedBy: 1, status: 1, createdAt: 1, updatedAt: 1 })
    .sort({ updatedAt: -1 })
    .lean<RivalryRecord[]>()
    .exec();
  if (rivalries.length === 0) return [];

  const rivalIds = rivalries.map((rivalry) =>
    rivalry.participantIds.find((id) => id.toString() !== actorId)?.toString(),
  ).filter((id): id is string => Boolean(id));
  const users = await UserModel.find({ _id: { $in: rivalIds } })
    .select({ username: 1, displayName: 1, avatarUrl: 1 })
    .lean<UserRecord[]>()
    .exec();
  const usersById = new Map(users.map((user) => [user._id.toString(), toParticipant(user)]));

  return rivalries.flatMap((rivalry) => {
    const rivalId = rivalry.participantIds.find((id) => id.toString() !== actorId)?.toString();
    const participant = rivalId ? usersById.get(rivalId) : undefined;
    if (!participant) return [];
    return [{
      id: rivalry._id.toString(),
      status: rivalry.status,
      requestedBy: rivalry.requestedBy.toString(),
      participant,
      createdAt: rivalry.createdAt.toISOString(),
      updatedAt: rivalry.updatedAt.toISOString(),
    }];
  });
}

export async function getRivalryDetail(
  actorId: string,
  rivalryId: string,
): Promise<RivalryDetail | null> {
  if (!Types.ObjectId.isValid(rivalryId)) return null;
  await connectToDatabase();

  const rivalry = await RivalryModel.findOne({
    _id: new Types.ObjectId(rivalryId),
    participantIds: new Types.ObjectId(actorId),
  })
    .select({ participantIds: 1, requestedBy: 1, status: 1, createdAt: 1 })
    .lean<RivalryRecord>()
    .exec();
  if (!rivalry) return null;

  const users = await UserModel.find({ _id: { $in: rivalry.participantIds } })
    .select({ username: 1, displayName: 1, avatarUrl: 1 })
    .lean<UserRecord[]>()
    .exec();
  const usersById = new Map(users.map((user) => [user._id.toString(), toParticipant(user)]));
  const participants = rivalry.participantIds.map((id) => usersById.get(id.toString()));
  if (!participants[0] || !participants[1]) return null;

  return {
    id: rivalry._id.toString(),
    status: rivalry.status,
    requestedBy: rivalry.requestedBy.toString(),
    participants: [participants[0], participants[1]],
    createdAt: rivalry.createdAt.toISOString(),
  };
}
