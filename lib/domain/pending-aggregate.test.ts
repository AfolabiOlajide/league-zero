import { describe, expect, it } from "vitest";

import type { MatchView } from "@/features/matches/types";
import { calculatePendingAggregate } from "./pending-aggregate";

function makeMatch(overrides: Partial<MatchView>): MatchView {
  return {
    id: "match-1",
    rivalryId: "rivalry-1",
    participantIds: ["user-1", "user-2"],
    scores: [2, 1],
    game: "ea-sports-fc",
    submittedBy: "user-1",
    status: "pending",
    playedAt: "2026-10-04T12:00:00.000Z",
    createdAt: "2026-10-04T12:00:00.000Z",
    ...overrides,
  };
}

describe("calculatePendingAggregate", () => {
  it("returns zero counts and tied status when there are no matches", () => {
    const aggregate = calculatePendingAggregate("user-1", "user-2", []);
    expect(aggregate).toEqual({
      totalMatches: 0,
      actorScore: 0,
      opponentScore: 0,
      actorWins: 0,
      opponentWins: 0,
      draws: 0,
      goalDifference: 0,
      leader: "tied",
    });
  });

  it("calculates aggregate scores, wins, draws, losses, and goal difference correctly", () => {
    const matches: MatchView[] = [
      makeMatch({ id: "m1", scores: [3, 1] }), // actor wins (+2)
      makeMatch({ id: "m2", scores: [2, 2] }), // draw
      makeMatch({ id: "m3", scores: [1, 4] }), // opponent wins (-3)
    ];

    const aggregate = calculatePendingAggregate("user-1", "user-2", matches);
    expect(aggregate).toEqual({
      totalMatches: 3,
      actorScore: 6,
      opponentScore: 7,
      actorWins: 1,
      opponentWins: 1,
      draws: 1,
      goalDifference: -1,
      leader: "opponent",
    });
  });

  it("handles reversed participantIds alignment correctly", () => {
    const matches: MatchView[] = [
      // user-1 is index 1, user-2 is index 0
      makeMatch({
        id: "m1",
        participantIds: ["user-2", "user-1"],
        scores: [0, 4], // user-2: 0, user-1: 4
      }),
      // user-1 is index 0, user-2 is index 1
      makeMatch({
        id: "m2",
        participantIds: ["user-1", "user-2"],
        scores: [2, 1], // user-1: 2, user-2: 1
      }),
    ];

    const aggregate = calculatePendingAggregate("user-1", "user-2", matches);
    expect(aggregate).toEqual({
      totalMatches: 2,
      actorScore: 6, // 4 + 2
      opponentScore: 1, // 0 + 1
      actorWins: 2,
      opponentWins: 0,
      draws: 0,
      goalDifference: 5,
      leader: "actor",
    });
  });
});
