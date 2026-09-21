import { ArrowRight, ChartNoAxesColumnIncreasing, Gamepad2, Plus, Search, Swords, Trophy } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { getRecentAcceptedMatchesForUser } from "@/features/matches/queries/matches";
import type { MatchView } from "@/features/matches/types";
import { getRivalriesForUser } from "@/features/rivalries/queries/rivalries";
import type { RivalrySummary } from "@/features/rivalries/types";
import { getCurrentAppUser } from "@/lib/auth/get-current-app-user";
import { cn } from "@/lib/utils";

const gameNames = { "ea-sports-fc": "EA Sports FC", efootball: "eFootball / PES", football: "Football", other: "Other" } as const;

export default async function HomePage() {
  const user = await getCurrentAppUser();
  const [rivalries, allAcceptedMatches] = user ? await Promise.all([getRivalriesForUser(user.id), getRecentAcceptedMatchesForUser(user.id)]) : [[], []];
  const recentMatches = allAcceptedMatches.slice(0, 5);
  const activeRivalries = rivalries.filter((rivalry) => rivalry.status === "active");
  const totalMatches = allAcceptedMatches.length;
  const wins = allAcceptedMatches.filter((match) => resultFor(match, user?.id) === "W").length;
  const winRate = totalMatches ? Math.round((wins / totalMatches) * 100) : 0;

  return <div className="animate-in fade-in-0 slide-in-from-bottom-2 duration-500">
    <header className="flex flex-wrap items-end justify-between gap-5"><div><p className="text-sm font-medium text-muted-foreground">Your 1v1 record</p><h1 className="mt-1 text-3xl font-semibold tracking-[-0.06em] sm:text-4xl">Welcome back, {user?.displayName ?? "rival"}.</h1></div><Link href="/search" className={cn(buttonVariants({ size: "lg" }), "h-11 rounded-xl px-4")}><Plus aria-hidden="true" />New rivalry</Link></header>

    <section className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Competition summary">
      <Stat icon={Gamepad2} label="Confirmed matches" value={totalMatches} tone="mint" />
      <Stat icon={Trophy} label="Wins" value={wins} tone="amber" />
      <Stat icon={Swords} label="Active rivalries" value={activeRivalries.length} tone="rose" />
      <Stat icon={ChartNoAxesColumnIncreasing} label="Win rate" value={`${winRate}%`} tone="blue" />
    </section>

    <div className="mt-10 grid gap-10 xl:grid-cols-[minmax(0,1fr)_19rem]"><div className="space-y-10">
      <section aria-labelledby="rivalries-heading"><SectionHeading id="rivalries-heading" title="Your rivalries" action={{ href: "/rivalries", label: "View all" }} />
        {activeRivalries.length ? <div className="mt-4 grid gap-3 sm:grid-cols-2">{activeRivalries.slice(0, 4).map((rivalry) => <RivalryCard key={rivalry.id} rivalry={rivalry} />)}</div> : <EmptyRivalries />}
      </section>
      <section aria-labelledby="recent-results-heading"><SectionHeading id="recent-results-heading" title="Recent results" action={recentMatches.length ? { href: "/rivalries", label: "View records" } : undefined} />
        {recentMatches.length ? <ul className="mt-4 overflow-hidden rounded-2xl border border-border bg-card shadow-xs">{recentMatches.map((match) => <RecentMatch key={match.id} match={match} actorId={user?.id ?? ""} rivalries={rivalries} />)}</ul> : <div className="mt-4 rounded-2xl border border-dashed border-border bg-card px-6 py-10 text-center"><p className="font-semibold">No official results yet</p><p className="mt-1 text-sm text-muted-foreground">Results appear here after both rivals confirm the score.</p></div>}
      </section>
    </div>
    <aside className="space-y-5 xl:pt-0"><section className="overflow-hidden rounded-3xl bg-sidebar p-6 text-sidebar-accent-foreground shadow-lg"><span className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-primary"><Swords aria-hidden="true" className="size-3.5" />Keep it official</span><h2 className="mt-8 text-3xl font-semibold leading-[0.96] tracking-[-0.06em]">Every rivalry deserves a record.</h2><p className="mt-4 text-sm leading-6 text-sidebar-foreground">Challenge someone you play and confirm every result together.</p><Link href="/search" className="mt-7 flex h-11 items-center justify-center gap-2 rounded-xl bg-background text-sm font-semibold text-foreground transition-transform hover:-translate-y-0.5 focus-visible:ring-3 focus-visible:ring-primary">Find a player<ArrowRight aria-hidden="true" className="size-4" /></Link></section><section className="rounded-2xl border border-border bg-card p-5"><p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Quick actions</p><div className="mt-4 space-y-1"><QuickAction href="/search" icon={Search} title="Find players" detail="Start a new rivalry" /><QuickAction href="/rivalries" icon={Swords} title="Open rivalries" detail="Review shared records" /></div></section></aside>
    </div>
  </div>;
}

function Stat({ icon: Icon, label, value, tone }: { icon: typeof Gamepad2; label: string; value: string | number; tone: "mint" | "amber" | "rose" | "blue" }) { const tones = { mint: "bg-primary/12 text-primary", amber: "bg-chart-4/15 text-chart-4", rose: "bg-destructive/10 text-destructive", blue: "bg-chart-2/10 text-chart-2" }; return <div className="rounded-2xl border border-border bg-card p-5 shadow-xs"><span className={cn("grid size-10 place-items-center rounded-xl", tones[tone])}><Icon aria-hidden="true" className="size-5" /></span><p className="mt-6 text-3xl font-semibold tracking-[-0.06em] tabular-nums">{value}</p><p className="mt-1 text-sm text-muted-foreground">{label}</p></div>; }
function SectionHeading({ id, title, action }: { id: string; title: string; action?: { href: string; label: string } }) { return <div className="flex items-center justify-between gap-4"><h2 id={id} className="text-xl font-semibold tracking-[-0.04em]">{title}</h2>{action && <Link href={action.href} className="text-sm font-semibold text-primary underline-offset-4 hover:underline">{action.label}</Link>}</div>; }
function RivalryCard({ rivalry }: { rivalry: RivalrySummary }) { return <Link href={`/rivalries/${rivalry.id}`} className="group rounded-2xl border border-border bg-card p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/45 hover:shadow-md focus-visible:ring-3 focus-visible:ring-ring/50"><div className="flex items-center gap-3"><Avatar className="size-11" size="lg">{rivalry.participant.avatarUrl && <AvatarImage src={rivalry.participant.avatarUrl} alt="" />}<AvatarFallback>{rivalry.participant.displayName.slice(0, 1)}</AvatarFallback></Avatar><div className="min-w-0"><p className="truncate font-semibold">{rivalry.participant.displayName}</p><p className="truncate text-sm text-muted-foreground">@{rivalry.participant.username}</p></div><ArrowRight aria-hidden="true" className="ml-auto size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" /></div><p className="mt-7 text-sm font-medium text-primary">Active shared record</p></Link>; }
function RecentMatch({ match, actorId, rivalries }: { match: MatchView; actorId: string; rivalries: RivalrySummary[] }) { const actorIndex = match.participantIds.indexOf(actorId); const otherIndex = actorIndex === 0 ? 1 : 0; const rival = rivalries.find((item) => item.id === match.rivalryId)?.participant; const result = resultFor(match, actorId); const game = match.game === "other" ? match.customGameLabel : gameNames[match.game]; return <li><Link href={`/matches/${match.id}`} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-border px-5 py-4 last:border-b-0 transition-colors hover:bg-muted/50 focus-visible:ring-3 focus-visible:ring-ring/50"><span className={cn("grid size-8 place-items-center rounded-lg text-xs font-bold", result === "W" ? "bg-primary/15 text-primary" : result === "L" ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground")}>{result}</span><div className="min-w-0"><p className="truncate font-medium">vs {rival?.displayName ?? "Rival"}</p><p className="mt-0.5 truncate text-sm text-muted-foreground">{game}</p></div><div className="text-right"><p className="font-mono text-lg font-semibold tracking-[-0.08em] tabular-nums">{match.scores[actorIndex]} — {match.scores[otherIndex]}</p><time className="text-xs text-muted-foreground" dateTime={match.playedAt}>{new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(match.playedAt))}</time></div></Link></li>; }
function QuickAction({ href, icon: Icon, title, detail }: { href: string; icon: typeof Search; title: string; detail: string }) { return <Link href={href} className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-muted"><span className="grid size-9 place-items-center rounded-lg bg-primary/12 text-primary"><Icon aria-hidden="true" className="size-4" /></span><span><span className="block text-sm font-semibold">{title}</span><span className="block text-xs text-muted-foreground">{detail}</span></span></Link>; }
function EmptyRivalries() { return <div className="mt-4 rounded-2xl border border-dashed border-border bg-card px-6 py-10"><Swords aria-hidden="true" className="size-7 text-primary" /><h3 className="mt-4 text-lg font-semibold">Start your first rivalry</h3><p className="mt-1 max-w-md text-sm leading-6 text-muted-foreground">Find the player you already compete with. Your shared record begins when they accept.</p><Link href="/search" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline">Find a rival <ArrowRight aria-hidden="true" className="size-4" /></Link></div>; }
function resultFor(match: MatchView, actorId: string | undefined) { const index = match.participantIds.indexOf(actorId ?? ""); if (index === -1) return "D"; const [mine, theirs] = index === 0 ? match.scores : [match.scores[1], match.scores[0]]; return mine === theirs ? "D" : mine > theirs ? "W" : "L"; }
