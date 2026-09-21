"use client";

import { useActionState } from "react";
import { UserRound } from "lucide-react";
import Link from "next/link";

import { StatusBadge } from "@/components/status-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { acceptRivalry, cancelRivalry, rejectRivalry } from "@/features/rivalries/actions/rivalry-actions";
import { initialRivalryActionState } from "@/features/rivalries/action-state";
import type { RivalrySummary } from "@/features/rivalries/types";
import { cn } from "@/lib/utils";

export function RivalryRow({ rivalry, actorId }: { rivalry: RivalrySummary; actorId: string }) {
  const [acceptState, acceptAction, accepting] = useActionState(acceptRivalry, initialRivalryActionState);
  const [rejectState, rejectAction, rejecting] = useActionState(rejectRivalry, initialRivalryActionState);
  const [cancelState, cancelAction, cancelling] = useActionState(cancelRivalry, initialRivalryActionState);
  const isRequester = rivalry.requestedBy === actorId;
  const isIncoming = rivalry.status === "pending" && !isRequester;
  const state = acceptState.status !== "idle" ? acceptState : rejectState.status !== "idle" ? rejectState : cancelState;
  const isPending = accepting || rejecting || cancelling;

  return (
    <li className="border-b border-border py-5 last:border-b-0">
      <div className="flex gap-3 sm:items-center sm:gap-4">
        <Avatar className="size-11" size="lg">
          {rivalry.participant.avatarUrl && <AvatarImage src={rivalry.participant.avatarUrl} alt="" />}
          <AvatarFallback><UserRound aria-hidden="true" className="size-5" /></AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {rivalry.status === "active" ? (
              <Link href={`/rivalries/${rivalry.id}`} className="truncate font-semibold outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50">{rivalry.participant.displayName}</Link>
            ) : <p className="truncate font-semibold">{rivalry.participant.displayName}</p>}
            <StatusBadge status={rivalry.status} />
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">@{rivalry.participant.username}</p>
          {rivalry.status === "pending" && <p className="mt-2 text-sm text-muted-foreground">{isIncoming ? "They want to start a shared record with you." : "Waiting for their decision."}</p>}
        </div>
      </div>
      {isIncoming && (
        <div className="mt-4 flex gap-2 pl-14 sm:mt-3">
          <form action={rejectAction}><input type="hidden" name="rivalryId" value={rivalry.id} /><Button type="submit" variant="outline" size="lg" className="h-11" disabled={isPending}>Reject</Button></form>
          <form action={acceptAction}><input type="hidden" name="rivalryId" value={rivalry.id} /><Button type="submit" size="lg" className="h-11 px-4" disabled={isPending}>{accepting ? "Accepting…" : "Accept rivalry"}</Button></form>
        </div>
      )}
      {rivalry.status === "pending" && isRequester && (
        <form action={cancelAction} className="mt-3 pl-14"><input type="hidden" name="rivalryId" value={rivalry.id} /><Button type="submit" variant="ghost" size="sm" disabled={isPending}>{cancelling ? "Cancelling…" : "Cancel request"}</Button></form>
      )}
      {state.status !== "idle" && <p aria-live="polite" className={cn("mt-3 pl-14 text-sm", state.status === "error" ? "text-destructive" : "text-muted-foreground")}>{state.message}</p>}
    </li>
  );
}
