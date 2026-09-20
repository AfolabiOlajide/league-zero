import "server-only";

import { model, models, Schema, type InferSchemaType, type Model } from "mongoose";

export const MATCH_STATUSES = ["pending", "accepted", "rejected"] as const;
export const MATCH_GAMES = ["ea-sports-fc", "efootball", "football", "other"] as const;

export type MatchStatus = (typeof MATCH_STATUSES)[number];
export type MatchGame = (typeof MATCH_GAMES)[number];

const matchSchema = new Schema(
  {
    rivalryId: { type: Schema.Types.ObjectId, required: true, index: true },
    participantIds: {
      type: [Schema.Types.ObjectId], required: true,
      validate: { validator: (value: unknown[]) => value.length === 2, message: "A match must have exactly two participants." },
    },
    scores: {
      type: [{ type: Number, min: 0, max: 99 }], required: true,
      validate: { validator: (value: unknown[]) => value.length === 2, message: "A match must have two scores." },
    },
    game: { type: String, enum: MATCH_GAMES, required: true },
    customGameLabel: { type: String, trim: true, maxlength: 40 },
    submittedBy: { type: Schema.Types.ObjectId, required: true },
    status: { type: String, enum: MATCH_STATUSES, required: true, index: true },
    playedAt: { type: Date, required: true },
    acceptedAt: { type: Date },
    rejectedAt: { type: Date },
    idempotencyKey: { type: String, required: true, immutable: true },
  },
  { timestamps: true, versionKey: false },
);

// A retried client submission is one logical match, even under concurrent POSTs.
matchSchema.index({ rivalryId: 1, submittedBy: 1, idempotencyKey: 1 }, { unique: true });
matchSchema.index({ rivalryId: 1, status: 1, playedAt: -1 });

export type MatchDocument = InferSchemaType<typeof matchSchema>;
export const MatchModel = (models.Match as Model<MatchDocument> | undefined) ?? model<MatchDocument>("Match", matchSchema);
