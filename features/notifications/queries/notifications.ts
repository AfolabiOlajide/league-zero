import "server-only";

import { Types } from "mongoose";

import { connectToDatabase } from "@/lib/db/connect";
import { NotificationModel, type NotificationType } from "@/models/notification";
import { UserModel } from "@/models/user";

export type NotificationItem = {
  id: string;
  type: NotificationType;
  entityType: "rivalry" | "match";
  entityId: string;
  actorName: string;
  createdAt: string;
  readAt?: string;
};

export async function getNotificationsForUser(actorId: string): Promise<NotificationItem[]> {
  await connectToDatabase();
  const notifications = await NotificationModel.find({ recipientId: new Types.ObjectId(actorId) })
    .select({ actorId: 1, type: 1, entityType: 1, entityId: 1, readAt: 1, createdAt: 1 })
    .sort({ createdAt: -1 })
    .limit(40)
    .lean<Array<{ _id: Types.ObjectId; actorId: Types.ObjectId; type: NotificationType; entityType: "rivalry" | "match"; entityId: Types.ObjectId; readAt?: Date; createdAt: Date }>>()
    .exec();
  if (notifications.length === 0) return [];

  const actors = await UserModel.find({ _id: { $in: notifications.map((item) => item.actorId) } })
    .select({ displayName: 1 })
    .lean<Array<{ _id: Types.ObjectId; displayName: string }>>()
    .exec();
  const actorNames = new Map(actors.map((actor) => [actor._id.toString(), actor.displayName]));

  return notifications.map((item) => ({
    id: item._id.toString(),
    type: item.type,
    entityType: item.entityType,
    entityId: item.entityId.toString(),
    actorName: actorNames.get(item.actorId.toString()) ?? "A LeagueZero player",
    createdAt: item.createdAt.toISOString(),
    readAt: item.readAt?.toISOString(),
  }));
}
