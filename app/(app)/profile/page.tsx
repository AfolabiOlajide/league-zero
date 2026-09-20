import { CalendarDays, UserRound } from "lucide-react";

import { getCurrentAppUser } from "@/lib/auth/get-current-app-user";

export default async function ProfilePage() {
  const user = await getCurrentAppUser();

  return (
    <div>
      <header className="border-b border-border pb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
          Profile
        </p>
        <div className="mt-5 flex items-center gap-5">
          <div className="grid size-20 place-items-center rounded-full bg-primary/15 text-primary">
            <UserRound aria-hidden="true" className="size-8" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-3xl font-semibold tracking-[-0.04em]">
              {user?.displayName}
            </h1>
            <p className="mt-1 text-muted-foreground">@{user?.username}</p>
          </div>
        </div>
      </header>

      <section className="py-8" aria-labelledby="record-heading">
        <h2 id="record-heading" className="text-lg font-semibold">
          Competition identity
        </h2>
        <dl className="mt-5 max-w-2xl divide-y divide-border border-y border-border">
          <div className="grid gap-1 py-5 sm:grid-cols-[11rem_1fr]">
            <dt className="text-sm text-muted-foreground">Display name</dt>
            <dd className="font-medium">{user?.displayName}</dd>
          </div>
          <div className="grid gap-1 py-5 sm:grid-cols-[11rem_1fr]">
            <dt className="text-sm text-muted-foreground">Username</dt>
            <dd className="font-medium">@{user?.username}</dd>
          </div>
          <div className="grid gap-1 py-5 sm:grid-cols-[11rem_1fr]">
            <dt className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays aria-hidden="true" className="size-4" />
              Joined
            </dt>
            <dd className="font-medium">
              {user
                ? new Intl.DateTimeFormat("en", {
                    dateStyle: "long",
                  }).format(new Date(user.createdAt))
                : "—"}
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
