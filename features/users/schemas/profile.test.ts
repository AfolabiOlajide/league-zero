import { describe, expect, it } from "vitest";

import { profileSchema } from "./profile";

describe("profileSchema", () => {
  it("trims names and normalizes usernames", () => {
    const result = profileSchema.parse({
      displayName: "  Olajide A.  ",
      username: " @Cipherr_01 ",
    });

    expect(result).toEqual({
      displayName: "Olajide A.",
      username: "cipherr_01",
    });
  });

  it.each(["ab", "has-dash", "has.dot", "with space", "way_too_long_for_the_policy"])(
    "rejects invalid username %s",
    (username) => {
      const result = profileSchema.safeParse({
        displayName: "Valid name",
        username,
      });

      expect(result.success).toBe(false);
    },
  );

  it("accepts the username boundary lengths", () => {
    expect(
      profileSchema.safeParse({ displayName: "Valid name", username: "abc" })
        .success,
    ).toBe(true);
    expect(
      profileSchema.safeParse({
        displayName: "Valid name",
        username: "abcdefghijklmnopqrst",
      }).success,
    ).toBe(true);
  });
});
