import { describe, expect, it } from "vitest";

import { createRivalrySchema, rivalryDecisionSchema } from "./rivalry";

const objectId = "507f1f77bcf86cd799439011";

describe("rivalry mutation schemas", () => {
  it("accepts Mongo object IDs from trusted UI forms", () => {
    expect(createRivalrySchema.safeParse({ targetUserId: objectId }).success).toBe(true);
    expect(rivalryDecisionSchema.safeParse({ rivalryId: objectId }).success).toBe(true);
  });

  it("rejects malformed resource IDs", () => {
    expect(createRivalrySchema.safeParse({ targetUserId: "not-an-id" }).success).toBe(false);
    expect(rivalryDecisionSchema.safeParse({ rivalryId: "" }).success).toBe(false);
  });
});
