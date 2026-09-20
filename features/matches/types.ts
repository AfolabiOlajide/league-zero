export type MatchStatus = "pending" | "accepted" | "rejected";
export type MatchGame = "ea-sports-fc" | "efootball" | "football" | "other";

export type MatchView = {
  id: string;
  rivalryId: string;
  participantIds: [string, string];
  scores: [number, number];
  game: MatchGame;
  customGameLabel?: string;
  submittedBy: string;
  status: MatchStatus;
  playedAt: string;
  createdAt: string;
};
