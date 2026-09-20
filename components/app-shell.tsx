"use client";

import { UserButton } from "@clerk/nextjs";
import {
  Bell,
  Home,
  Search,
  Swords,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Brand } from "@/components/brand";
import { ModeToggle } from "@/components/mode-toggle";
import type { AppUser } from "@/features/users/types";
import { formatUsername } from "@/features/users/username";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/rivalries", label: "Rivalries", icon: Swords },
  { href: "/search", label: "Search", icon: Search },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/profile", label: "Profile", icon: UserRound },
] as const;

function isRouteActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

type AppShellProps = {
  children: React.ReactNode;
  user: AppUser;
};

export function AppShell({ children, user }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-svh bg-background md:grid md:grid-cols-[15.5rem_minmax(0,1fr)]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[15.5rem] border-r border-sidebar-border bg-sidebar md:flex md:flex-col">
        <div className="flex h-18 items-center px-5">
          <Brand />
        </div>

        <nav aria-label="Primary navigation" className="flex-1 px-3 py-5">
          <ul className="space-y-1">
            {navigation.map(({ href, label, icon: Icon }) => {
              const active = isRouteActive(pathname, href);

              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-sidebar-foreground/70 outline-none transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-3 focus-visible:ring-sidebar-ring/50",
                      active &&
                        "bg-sidebar-accent text-sidebar-accent-foreground",
                    )}
                  >
                    <Icon aria-hidden="true" className="size-4.5" />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-sidebar-border p-4">
          <div className="flex min-w-0 items-center gap-3">
            <UserButton />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">
                {user.displayName}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {formatUsername(user.username)}
              </p>
            </div>
            <ModeToggle />
          </div>
        </div>
      </aside>

      <div className="min-w-0 md:col-start-2">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/90 px-5 backdrop-blur md:hidden">
          <Brand compact />
          <div className="flex items-center gap-2">
            <ModeToggle />
            <UserButton />
          </div>
        </header>

        <main className="mx-auto min-h-[calc(100svh-4rem)] w-full max-w-6xl px-5 pb-28 pt-8 sm:px-8 md:min-h-svh md:pb-12 md:pt-10 lg:px-12">
          {children}
        </main>

        <nav
          aria-label="Primary navigation"
          className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur md:hidden"
        >
          <ul className="grid grid-cols-5">
            {navigation.map(({ href, label, icon: Icon }) => {
              const active = isRouteActive(pathname, href);

              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg text-[0.68rem] font-medium text-muted-foreground outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
                      active && "bg-primary/15 text-foreground",
                    )}
                  >
                    <Icon
                      aria-hidden="true"
                      className={cn("size-5", active && "text-primary")}
                    />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
