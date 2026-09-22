import { AtSign, CalendarDays, UserRound } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getCurrentAppUser } from "@/lib/auth/get-current-app-user";

export default async function ProfilePage() {
    const user = await getCurrentAppUser();
    const displayName = user?.displayName ?? "Player";
    const joinedAt = user ? new Date(user.createdAt) : null;
    const joinedLabel = joinedAt
        ? new Intl.DateTimeFormat("en", {
              month: "long",
              year: "numeric",
          }).format(joinedAt)
        : "—";
    const joinedDate = joinedAt
        ? new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(joinedAt)
        : "—";
    const initials = displayName
        .split(/\s+/)
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return (
        <div className="mx-auto max-w-6xl animate-in fade-in-0 slide-in-from-bottom-2 duration-500 motion-reduce:animate-none">
            <header className="relative overflow-hidden rounded-3xl bg-sidebar px-6 py-7 text-sidebar-accent-foreground shadow-lg sm:px-9 sm:py-10">
                <div className="absolute -right-16 -top-24 size-64 rounded-full border border-primary/20" />
                <div className="absolute -right-8 -top-16 size-40 rounded-full bg-primary/8" />

                <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_13rem] lg:items-end lg:gap-12">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
                            Player profile
                        </p>
                        <div className="mt-7 flex items-center gap-5 sm:gap-6">
                            <Avatar
                                className="size-20 bg-primary text-primary-foreground shadow-lg ring-4 ring-primary/10 sm:size-24"
                                size="lg"
                            >
                                {user?.avatarUrl ? (
                                    <AvatarImage src={user.avatarUrl} alt="" />
                                ) : null}
                                <AvatarFallback className="bg-primary text-2xl font-semibold tracking-[-0.08em] text-primary-foreground sm:text-3xl">
                                    {initials || (
                                        <UserRound
                                            aria-hidden="true"
                                            className="size-9"
                                        />
                                    )}
                                </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                                <h1 className="truncate text-4xl font-semibold tracking-[-0.07em] sm:text-5xl">
                                    {displayName}
                                </h1>
                                <p className="mt-2 flex items-center gap-2 text-sm font-medium text-sidebar-foreground sm:text-base">
                                    <span
                                        className="size-1.5 rounded-full bg-primary"
                                        aria-hidden="true"
                                    />
                                    @{user?.username ?? "—"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-5 lg:border-t-0 lg:border-l lg:pl-7 lg:pt-0">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-sidebar-foreground">
                            LeagueZero member
                        </p>
                        <p className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-sidebar-accent-foreground">
                            {joinedLabel}
                        </p>
                    </div>
                </div>
            </header>

            <section
                className="mt-10 grid gap-8 lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-12"
                aria-labelledby="identity-heading"
            >
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                        Record
                    </p>
                    <h2
                        id="identity-heading"
                        className="mt-3 text-2xl font-semibold tracking-[-0.05em]"
                    >
                        Competition identity
                    </h2>
                    <p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">
                        The details attached to every rivalry and result you
                        record.
                    </p>
                </div>

                <dl className="divide-y divide-border">
                    <IdentityRow label="Display name" value={displayName} />
                    <IdentityRow
                        label="Username"
                        icon={AtSign}
                        value={`@${user?.username ?? "—"}`}
                    />
                    <IdentityRow
                        label="Joined"
                        icon={CalendarDays}
                        value={joinedDate}
                        dateTime={joinedAt?.toISOString()}
                    />
                </dl>
            </section>
        </div>
    );
}

function IdentityRow({
    label,
    value,
    icon: Icon,
    dateTime,
}: {
    label: string;
    value: string;
    icon?: typeof CalendarDays;
    dateTime?: string;
}) {
    return (
        <div className="grid gap-2 py-5 first:pt-0 sm:grid-cols-[10rem_minmax(0,1fr)] sm:items-center sm:gap-6">
            <dt className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                {Icon ? <Icon aria-hidden="true" className="size-4" /> : null}
                {label}
            </dt>
            <dd className="text-lg font-medium tracking-[-0.025em]">
                {dateTime ? <time dateTime={dateTime}>{value}</time> : value}
            </dd>
        </div>
    );
}
