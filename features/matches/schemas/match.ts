import { z } from "zod";

import { EARLIEST_PLAYED_DATE, SCORE_MAXIMUM } from "../constants";

export { EARLIEST_PLAYED_DATE, SCORE_MAXIMUM } from "../constants";

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "This record is no longer valid. Refresh and try again.");
const dateValue = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose the date the match was played.")
  .refine((value) => value >= EARLIEST_PLAYED_DATE, `Choose a date on or after ${EARLIEST_PLAYED_DATE}.`)
  .refine((value) => value <= new Date().toISOString().slice(0, 10), "A match cannot be dated in the future.");
const scores = z.coerce.number().int("Scores must be whole numbers.").min(0, "Scores cannot be negative.").max(SCORE_MAXIMUM, `Scores cannot exceed ${SCORE_MAXIMUM}.`);

const matchFields = z.object({
  myScore: scores,
  opponentScore: scores,
  game: z.enum(["ea-sports-fc", "efootball", "football", "other"]),
  customGameLabel: z.string().trim().max(40, "Keep the game label under 40 characters.").optional(),
  playedAt: dateValue,
}).superRefine((value, context) => {
  if (value.game === "other" && !value.customGameLabel) {
    context.addIssue({ code: "custom", path: ["customGameLabel"], message: "Name the game or activity." });
  }
});

export const createMatchSchema = matchFields.extend({
  rivalryId: objectId,
  idempotencyKey: z.uuid("This form expired. Refresh and try again."),
});
export const updateMatchSchema = matchFields.extend({ matchId: objectId });
export const decideMatchSchema = z.object({ matchId: objectId });
