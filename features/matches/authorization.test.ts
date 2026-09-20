import { describe, expect, it } from "vitest";
import { alignScores, canDecideMatch } from "./authorization";

describe("match authorization helpers", () => {
  it("keeps score order aligned with canonical participants", () => {
    expect(alignScores(["a", "b"], "a", 3, 1)).toEqual([3, 1]);
    expect(alignScores(["a", "b"], "b", 3, 1)).toEqual([1, 3]);
  });
  it("allows only the non-submitting participant to decide", () => {
    expect(canDecideMatch(["a", "b"], "a", "b")).toBe(true);
    expect(canDecideMatch(["a", "b"], "a", "a")).toBe(false);
    expect(canDecideMatch(["a", "b"], "a", "c")).toBe(false);
  });
});
