import { describe, expect, it } from "vitest";

import { formatUsername, normalizeUsername } from "./username";

describe("normalizeUsername", () => {
  it.each([
    [" Cipherr ", "cipherr"],
    ["@League_Zero", "league_zero"],
    ["@@Rival", "rival"],
  ])("normalizes %s", (input, expected) => {
    expect(normalizeUsername(input)).toBe(expected);
  });
});

describe("formatUsername", () => {
  it("returns a normalized display handle", () => {
    expect(formatUsername(" @CIPHERR ")).toBe("@cipherr");
  });
});
