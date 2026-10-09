import { describe, expect, it } from "vitest";

import type { MatchView } from "@/features/matches/types";
import { groupConfirmedHistoryByDay } from "./confirmed-history-groups";

function match(overrides: Partial<MatchView>): MatchView {
  return {
    id: "match-1",
    rivalryId: "rivalry-1",
    participantIds: ["cipher", "trojan"],
    scores: [2, 1],
    game: "efootball",
    submittedBy: "cipher",
    status: "accepted",
    playedAt: "2026-10-04T12:00:00.000Z",
    createdAt: "2026-10-04T12:00:00.000Z",
    ...overrides,
  };
}

describe("groupConfirmedHistoryByDay", () => {
  it("keeps the existing history order while counting each day's results in actor order", () => {
    const groups = groupConfirmedHistoryByDay(
      [
        match({ id: "latest", scores: [2, 1] }),
        match({ id: "same-day", scores: [1, 3] }),
        match({
          id: "older",
          participantIds: ["trojan", "cipher"],
          scores: [2, 4],
          playedAt: "2026-10-03T12:00:00.000Z",
        }),
      ],
      "cipher",
    );

    expect(groups).toMatchObject([
      { date: "2026-10-04", actorWins: 1, opponentWins: 1, draws: 0 },
      { date: "2026-10-03", actorWins: 1, opponentWins: 0, draws: 0 },
    ]);
    expect(groups[0]?.matches.map(({ id }) => id)).toEqual([
      "latest",
      "same-day",
    ]);
  });

  it("omits a malformed row that does not include the viewing player", () => {
    const groups = groupConfirmedHistoryByDay(
      [match({ participantIds: ["other", "trojan"] })],
      "cipher",
    );

    expect(groups).toEqual([]);
  });
});
