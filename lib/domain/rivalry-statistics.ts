import type { MatchView } from "@/features/matches/types";

export type FormResult = "W" | "D" | "L";
export type ParticipantStatistics = {
  id: string; matches: number; wins: number; losses: number; draws: number;
  scoresFor: number; scoresAgainst: number; winRate: number; form: FormResult[];
  currentStreak: { result: FormResult; length: number } | null; largestWin: number;
};
export type RivalryStatistics = {
  participants: [ParticipantStatistics, ParticipantStatistics];
  highestScoringMatch: { id: string; totalScore: number; scores: [number, number] } | null;
};

function chronological(matches: MatchView[]) {
  return matches.filter((match) => match.status === "accepted").slice().sort((a, b) =>
    a.playedAt.localeCompare(b.playedAt) || a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id),
  );
}
function outcome(forScore: number, againstScore: number): FormResult { return forScore === againstScore ? "D" : forScore > againstScore ? "W" : "L"; }

export function calculateRivalryStatistics(participantIds: [string, string], matches: MatchView[]): RivalryStatistics {
  const ordered = chronological(matches);
  const participants = participantIds.map((id, index) => {
    const results = ordered.map((match) => outcome(match.scores[index], match.scores[index === 0 ? 1 : 0]));
    const streakResult = results.at(-1); let streakLength = 0;
    if (streakResult) for (let cursor = results.length - 1; cursor >= 0 && results[cursor] === streakResult; cursor--) streakLength++;
    return {
      id, matches: ordered.length, wins: results.filter((result) => result === "W").length, losses: results.filter((result) => result === "L").length,
      draws: results.filter((result) => result === "D").length, scoresFor: ordered.reduce((total, match) => total + match.scores[index], 0),
      scoresAgainst: ordered.reduce((total, match) => total + match.scores[index === 0 ? 1 : 0], 0),
      winRate: ordered.length ? Math.round((results.filter((result) => result === "W").length / ordered.length) * 100) : 0,
      form: results.slice(-5).reverse(), currentStreak: streakResult ? { result: streakResult, length: streakLength } : null,
      largestWin: ordered.reduce((largest, match) => Math.max(largest, Math.max(0, match.scores[index] - match.scores[index === 0 ? 1 : 0])), 0),
    };
  }) as [ParticipantStatistics, ParticipantStatistics];
  const highestScoringMatch = ordered.reduce<RivalryStatistics["highestScoringMatch"]>((highest, match) => {
    const totalScore = match.scores[0] + match.scores[1];
    return !highest || totalScore > highest.totalScore ? { id: match.id, totalScore, scores: match.scores } : highest;
  }, null);
  return { participants, highestScoringMatch };
}
