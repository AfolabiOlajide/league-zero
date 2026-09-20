import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MatchForm } from "@/features/matches/components/match-form";
import { getRivalryDetail } from "@/features/rivalries/queries/rivalries";
import { getCurrentAppUser } from "@/lib/auth/get-current-app-user";

export default async function LogMatchPage({ params }: { params: Promise<{ rivalryId: string }> }) {
  const { rivalryId } = await params; const user = await getCurrentAppUser(); const rivalry = user ? await getRivalryDetail(user.id, rivalryId) : null;
  if (!user || !rivalry || rivalry.status !== "active") notFound();
  const opponent = rivalry.participants.find((participant) => participant.id !== user.id); if (!opponent) notFound();
  return <div className="mx-auto max-w-2xl"><Link href={`/rivalries/${rivalryId}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"><ArrowLeft aria-hidden="true" className="size-4" />Back to rivalry</Link><header className="mt-7 border-b border-border pb-7"><p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Log match</p><h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">Record a result with {opponent.displayName}.</h1><p className="mt-3 leading-7 text-muted-foreground">Your opponent will verify the score before it becomes official.</p></header><MatchForm rivalryId={rivalryId} actor={{ id: user.id, displayName: user.displayName }} opponent={{ displayName: opponent.displayName }} /></div>;
}
