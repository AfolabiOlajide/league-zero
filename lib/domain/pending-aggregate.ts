import type { MatchView } from "@/features/matches/types";

export type PendingAggregate = {
  totalMatches: number;
  actorScore: number;
  opponentScore: number;
  actorWins: number;
  opponentWins: number;
  draws: number;
  goalDifference: number;
  leader: "actor" | "opponent" | "tied";
};

export function calculatePendingAggregate(
  actorId: string,
  _opponentId: string,
  matches: MatchView[],
): PendingAggregate {
  let actorScore = 0;
  let opponentScore = 0;
  let actorWins = 0;
  let opponentWins = 0;
  let draws = 0;

  for (const match of matches) {
    const actorIndex = match.participantIds.indexOf(actorId);
    if (actorIndex === -1) continue;
    const opponentIndex = actorIndex === 0 ? 1 : 0;

    const aScore = match.scores[actorIndex] ?? 0;
    const oScore = match.scores[opponentIndex] ?? 0;

    actorScore += aScore;
    opponentScore += oScore;

    if (aScore > oScore) {
      actorWins++;
    } else if (oScore > aScore) {
      opponentWins++;
    } else {
      draws++;
    }
  }

  const goalDifference = actorScore - opponentScore;
  const leader =
    actorScore > opponentScore
      ? "actor"
      : opponentScore > actorScore
        ? "opponent"
        : "tied";

  return {
    totalMatches: matches.length,
    actorScore,
    opponentScore,
    actorWins,
    opponentWins,
    draws,
    goalDifference,
    leader,
  };
}
