import { describe, expect, it } from "vitest";
import { calculateRivalryStatistics } from "./rivalry-statistics";

const participants: [string, string] = ["a", "b"];
function match(id: string, scores: [number, number], status: "accepted" | "pending" | "rejected" = "accepted", playedAt = "2026-01-01") { return { id, rivalryId: "r", participantIds: participants, scores, game: "football" as const, submittedBy: "a", status, playedAt: `${playedAt}T12:00:00.000Z`, createdAt: `${playedAt}T13:00:00.000Z` }; }

describe("calculateRivalryStatistics", () => {
  it("derives an aligned official record from accepted matches only", () => {
    const result = calculateRivalryStatistics(participants, [match("one", [2, 0], "accepted", "2026-01-01"), match("two", [1, 1], "accepted", "2026-01-02"), match("pending", [99, 0], "pending", "2026-01-03"), match("rejected", [88, 0], "rejected", "2026-01-04")]);
    expect(result.participants[0]).toMatchObject({ matches: 2, wins: 1, losses: 0, draws: 1, scoresFor: 3, scoresAgainst: 1, winRate: 50, form: ["D", "W"], currentStreak: { result: "D", length: 1 }, largestWin: 2 });
    expect(result.participants[1]).toMatchObject({ matches: 2, wins: 0, losses: 1, draws: 1, scoresFor: 1, scoresAgainst: 3, winRate: 0, form: ["D", "L"] });
  });
  it("uses played date, creation time, then id to break ordering ties deterministically", () => {
    const first = match("a", [0, 1]); const second = match("b", [2, 0]);
    first.createdAt = "2026-01-01T12:00:00.000Z"; second.createdAt = "2026-01-01T12:00:00.000Z";
    const result = calculateRivalryStatistics(participants, [second, first]);
    expect(result.participants[0].form).toEqual(["W", "L"]);
    expect(result.participants[0].currentStreak).toEqual({ result: "W", length: 1 });
  });
  it("handles no matches, all draws, and earliest highest-score ties", () => {
    expect(calculateRivalryStatistics(participants, []).participants[0]).toMatchObject({ matches: 0, winRate: 0, form: [], currentStreak: null });
    const result = calculateRivalryStatistics(participants, [match("first", [3, 3], "accepted", "2026-01-01"), match("later", [4, 2], "accepted", "2026-01-02")]);
    expect(result.participants[0].draws).toBe(1); expect(result.highestScoringMatch?.id).toBe("first");
  });
});
