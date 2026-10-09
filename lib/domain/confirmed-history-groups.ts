import type { MatchView } from "@/features/matches/types";

export type ConfirmedHistoryGroup = {
  date: string;
  matches: MatchView[];
  actorWins: number;
  opponentWins: number;
  draws: number;
};

/**
 * Groups the already-paginated history slice by its played day. Dates are
 * stored at noon UTC, so the ISO date remains the player-selected calendar day.
 */
export function groupConfirmedHistoryByDay(
  matches: MatchView[],
  actorId: string,
): ConfirmedHistoryGroup[] {
  const groups = new Map<string, ConfirmedHistoryGroup>();

  for (const match of matches) {
    const actorIndex = match.participantIds.indexOf(actorId);
    if (actorIndex === -1) continue;

    const date = match.playedAt.slice(0, 10);
    const group = groups.get(date) ?? {
      date,
      matches: [],
      actorWins: 0,
      opponentWins: 0,
      draws: 0,
    };
    const opponentIndex = actorIndex === 0 ? 1 : 0;

    group.matches.push(match);
    const actorScore = match.scores[actorIndex] ?? 0;
    const opponentScore = match.scores[opponentIndex] ?? 0;

    if (actorScore > opponentScore) {
      group.actorWins += 1;
    } else if (opponentScore > actorScore) {
      group.opponentWins += 1;
    } else {
      group.draws += 1;
    }
    groups.set(date, group);
  }

  return [...groups.values()];
}
