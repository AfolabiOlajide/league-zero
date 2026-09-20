import "server-only";

import {
  model,
  models,
  Schema,
  type InferSchemaType,
  type Model,
} from "mongoose";

export const RIVALRY_STATUSES = [
  "pending",
  "active",
  "rejected",
  "cancelled",
] as const;

export type RivalryStatus = (typeof RIVALRY_STATUSES)[number];

const rivalrySchema = new Schema(
  {
    participantIds: {
      type: [Schema.Types.ObjectId],
      required: true,
      validate: {
        validator: (value: unknown[]) => value.length === 2,
        message: "A rivalry must have exactly two participants.",
      },
    },
    // The stable, ordered identity of the two participants. Its unique index
    // is the final guard against duplicate relationships under concurrency.
    pairKey: { type: String, required: true, unique: true, immutable: true },
    requestedBy: { type: Schema.Types.ObjectId, required: true },
    status: { type: String, enum: RIVALRY_STATUSES, required: true },
    acceptedAt: { type: Date },
    rejectedAt: { type: Date },
    cancelledAt: { type: Date },
  },
  { timestamps: true, versionKey: false },
);

rivalrySchema.index({ participantIds: 1, status: 1 });

export type RivalryDocument = InferSchemaType<typeof rivalrySchema>;

export const RivalryModel =
  (models.Rivalry as Model<RivalryDocument> | undefined) ??
  model<RivalryDocument>("Rivalry", rivalrySchema);
