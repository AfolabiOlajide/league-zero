import "server-only";

import {
  model,
  models,
  Schema,
  type InferSchemaType,
  type Model,
} from "mongoose";

export const NOTIFICATION_TYPES = [
  "rivalry_requested",
  "rivalry_accepted",
  "rivalry_rejected",
  "match_submitted",
  "match_accepted",
  "match_rejected",
] as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

const notificationSchema = new Schema(
  {
    recipientId: { type: Schema.Types.ObjectId, required: true, index: true },
    actorId: { type: Schema.Types.ObjectId, required: true },
    type: { type: String, enum: NOTIFICATION_TYPES, required: true },
    entityType: { type: String, enum: ["rivalry", "match"], required: true },
    entityId: { type: Schema.Types.ObjectId, required: true },
    readAt: { type: Date },
  },
  { timestamps: { createdAt: true, updatedAt: false }, versionKey: false },
);

notificationSchema.index({ recipientId: 1, createdAt: -1 });

export type NotificationDocument = InferSchemaType<typeof notificationSchema>;

export const NotificationModel =
  (models.Notification as Model<NotificationDocument> | undefined) ??
  model<NotificationDocument>("Notification", notificationSchema);
