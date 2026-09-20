import { describe, expect, it } from "vitest";

import { canonicalParticipantIds, createPairKey, isRivalryRecipient } from "./pair";

describe("rivalry pair identity", () => {
  it("is stable no matter who initiates the request", () => {
    expect(createPairKey("b", "a")).toBe("a:b");
    expect(canonicalParticipantIds("b", "a")).toEqual(["a", "b"]);
  });

  it("rejects self-rivalries and recognizes only the recipient", () => {
    expect(() => createPairKey("a", "a")).toThrow("cannot create");
    expect(isRivalryRecipient(["a", "b"], "a", "b")).toBe(true);
    expect(isRivalryRecipient(["a", "b"], "a", "a")).toBe(false);
    expect(isRivalryRecipient(["a", "b"], "a", "c")).toBe(false);
  });
});
