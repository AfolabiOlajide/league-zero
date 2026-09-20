import { Clock3, Swords, UserRound } from "lucide-react";
import { notFound } from "next/navigation";

import { StatusBadge } from "@/components/status-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { RivalryDecisionControls } from "@/features/rivalries/components/rivalry-decision-controls";
import { getRivalryDetail } from "@/features/rivalries/queries/rivalries";
import { getCurrentAppUser } from "@/lib/auth/get-current-app-user";

type RivalryPageProps = { params: Promise<{ rivalryId: string }> };

export default async function RivalryPage({ params }: RivalryPageProps) {
  const { rivalryId } = await params;
  const user = await getCurrentAppUser();
  const rivalry = user ? await getRivalryDetail(user.id, rivalryId) : null;
  if (!user || !rivalry) notFound();

  const [first, second] = rivalry.participants;
  const isActive = rivalry.status === "active";
  return (
    <div className="mx-auto max-w-4xl">
      <header className="border-b border-border pb-8">
        <div className="flex justify-center"><StatusBadge status={rivalry.status} /></div>
        <div className="mt-7 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 sm:gap-7">
          <PlayerIdentity player={first} align="right" />
          <div className="grid size-12 place-items-center rounded-full border border-border text-sm font-bold tracking-[0.18em] text-muted-foreground">VS</div>
          <PlayerIdentity player={second} />
        </div>
        <div className="mt-8 text-center"><p className="text-sm text-muted-foreground">Official record</p><p className="mt-1 font-mono text-4xl font-semibold tabular-nums tracking-[-0.08em] sm:text-5xl">0 — 0 — 0</p><p className="mt-2 text-sm text-muted-foreground">No confirmed matches yet</p></div>
      </header>

      {isActive ? <section className="border-b border-border py-8"><dl className="grid grid-cols-3 divide-x divide-border text-center"><div><dt className="text-sm text-muted-foreground">Matches</dt><dd className="mt-1 text-2xl font-semibold tabular-nums">0</dd></div><div><dt className="text-sm text-muted-foreground">Goals</dt><dd className="mt-1 text-2xl font-semibold tabular-nums">0–0</dd></div><div><dt className="text-sm text-muted-foreground">Pending</dt><dd className="mt-1 text-2xl font-semibold tabular-nums">0</dd></div></dl></section> : rivalry.status === "pending" ? <RivalryDecisionControls rivalryId={rivalry.id} isRequester={rivalry.requestedBy === user.id} /> : <section className="border-b border-border py-7 text-center"><Clock3 aria-hidden="true" className="mx-auto size-5 text-muted-foreground" /><p className="mt-3 text-sm text-muted-foreground">This rivalry must be active before its shared record can begin.</p></section>}

      <section className="py-9" aria-labelledby="history-heading"><div className="flex items-center justify-between gap-4"><div><h2 id="history-heading" className="text-lg font-semibold">Match history</h2><p className="mt-1 text-sm text-muted-foreground">Confirmed results will appear here.</p></div><Button size="lg" className="h-11" disabled title="Match logging arrives in the next build unit">Log match</Button></div><div className="mt-7 border-y border-border py-10 text-center"><Swords aria-hidden="true" className="mx-auto size-7 text-muted-foreground" /><p className="mt-3 font-medium">No matches recorded</p><p className="mt-1 text-sm text-muted-foreground">Match logging is the next part of the competition loop.</p></div></section>
    </div>
  );
}

function PlayerIdentity({ player, align }: { player: { displayName: string; username: string; avatarUrl?: string }; align?: "right" }) {
  return <div className={align === "right" ? "min-w-0 text-right" : "min-w-0"}><Avatar className={align === "right" ? "ml-auto size-14 sm:size-16" : "size-14 sm:size-16"} size="lg">{player.avatarUrl && <AvatarImage src={player.avatarUrl} alt="" />}<AvatarFallback><UserRound aria-hidden="true" className="size-6" /></AvatarFallback></Avatar><p className="mt-3 truncate text-base font-semibold sm:text-lg">{player.displayName}</p><p className="truncate text-sm text-muted-foreground">@{player.username}</p></div>;
}
