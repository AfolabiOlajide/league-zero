import Link from "next/link";
import { MatchStatusBadge } from "@/components/match-status-badge";
import type { MatchView } from "@/features/matches/types";

const gameNames = { "ea-sports-fc": "EA Sports FC", efootball: "eFootball / PES", football: "Football", other: "Other" } as const;
export function MatchRow({ match, actorId }: { match: MatchView; actorId: string }) {
  const actorIndex = match.participantIds.indexOf(actorId); const opponentIndex = actorIndex === 0 ? 1 : 0;
  return <li><Link href={`/matches/${match.id}`} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-border py-4 outline-none transition-colors hover:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/50"><div><div className="flex flex-wrap items-center gap-2"><MatchStatusBadge status={match.status} /><time className="text-sm text-muted-foreground" dateTime={match.playedAt}>{new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(match.playedAt))}</time></div><p className="mt-2 text-sm text-muted-foreground">{match.game === "other" ? match.customGameLabel : gameNames[match.game]}</p></div><p className="font-mono text-2xl font-semibold tabular-nums tracking-[-0.06em]">{match.scores[actorIndex]} — {match.scores[opponentIndex]}</p></Link></li>;
}
