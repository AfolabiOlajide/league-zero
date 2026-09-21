"use client";

import { useActionState } from "react";
import { UserRound } from "lucide-react";

import { StatusBadge } from "@/components/status-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { requestRivalry } from "@/features/rivalries/actions/rivalry-actions";
import { initialRivalryActionState } from "@/features/rivalries/action-state";
import type { SearchUserResult } from "@/features/rivalries/types";

function initials(name: string) {
  return name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

export function UserSearchResult({ user }: { user: SearchUserResult }) {
  const [state, formAction, pending] = useActionState(requestRivalry, initialRivalryActionState);
  const rivalry = user.rivalry;
  const isIncoming = rivalry?.requestedBy === user.id;
  const canRequest = !rivalry || rivalry.status === "rejected" || rivalry.status === "cancelled";

  return (
    <li className="border-b border-border py-4 last:border-b-0">
      <div className="flex items-center gap-3 sm:gap-4">
        <Avatar className="size-11" size="lg">
          {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt="" />}
          <AvatarFallback><UserRound aria-hidden="true" className="size-5" />{!user.avatarUrl && initials(user.displayName)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{user.displayName}</p>
          <p className="truncate text-sm text-muted-foreground">@{user.username}</p>
        </div>
        {canRequest ? (
          <form action={formAction}>
            <input type="hidden" name="targetUserId" value={user.id} />
            <Button type="submit" size="lg" className="h-11 px-4" disabled={pending}>
              {pending ? "Sending…" : rivalry ? "Request again" : "Send request"}
            </Button>
          </form>
        ) : (
          <div className="flex flex-col items-end gap-1.5">
            <StatusBadge status={rivalry.status} />
            {rivalry.status === "pending" && <span className="text-xs text-muted-foreground">{isIncoming ? "Your decision" : "Awaiting them"}</span>}
          </div>
        )}
      </div>
      {state.status !== "idle" && (
        <p aria-live="polite" className={state.status === "error" ? "mt-3 text-sm text-destructive" : "mt-3 text-sm text-muted-foreground"}>
          {state.message}
        </p>
      )}
    </li>
  );
}
