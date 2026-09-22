import { describe, expect, it } from "vitest";

import { createMatchSchema, EARLIEST_PLAYED_DATE, SCORE_MAXIMUM } from "./match";

const base = { rivalryId: "507f1f77bcf86cd799439011", idempotencyKey: "d9428888-122b-11e1-b85c-61cd3cbb3210", myScore: "4", opponentScore: "3", game: "ea-sports-fc", playedAt: "2026-09-20" };

describe("match validation", () => {
  it("accepts a draw and coerces valid score fields", () => {
    const result = createMatchSchema.parse({ ...base, myScore: "2", opponentScore: "2" });
    expect(result.myScore).toBe(2);
    expect(result.opponentScore).toBe(2);
  });

  it("requires a label for Other and rejects invalid bounds", () => {
    expect(createMatchSchema.safeParse({ ...base, game: "other" }).success).toBe(false);
    expect(createMatchSchema.safeParse({ ...base, myScore: String(SCORE_MAXIMUM) }).success).toBe(true);
    expect(createMatchSchema.safeParse({ ...base, myScore: String(SCORE_MAXIMUM + 1) }).success).toBe(false);
    expect(createMatchSchema.safeParse({ ...base, playedAt: "1999-12-31" }).success).toBe(false);
    expect(EARLIEST_PLAYED_DATE).toBe("2000-01-01");
  });
});
