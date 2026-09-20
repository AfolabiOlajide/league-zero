import { auth, currentUser } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Brand } from "@/components/brand";
import { ModeToggle } from "@/components/mode-toggle";
import { OnboardingForm } from "@/features/users/components/onboarding-form";
import { getUserByClerkId } from "@/features/users/queries/get-user-by-clerk-id";
import { normalizeUsername } from "@/features/users/username";

export const metadata: Metadata = {
  title: "Create your profile",
};

export default async function OnboardingPage() {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated || !userId) {
    redirect("/sign-in");
  }

  const existingUser = await getUserByClerkId(userId);
  if (existingUser) {
    redirect("/home");
  }

  const clerkUser = await currentUser();
  const displayName = clerkUser?.fullName ?? clerkUser?.firstName ?? "";
  const username = normalizeUsername(clerkUser?.username ?? "");

  return (
    <main className="min-h-svh bg-background">
      <header className="flex h-18 items-center justify-between border-b border-border px-5 sm:px-8">
        <Brand href="/" />
        <ModeToggle />
      </header>

      <div className="mx-auto grid min-h-[calc(100svh-4.5rem)] max-w-6xl lg:grid-cols-[minmax(0,0.9fr)_minmax(28rem,1.1fr)]">
        <section className="relative hidden overflow-hidden border-r border-border px-12 py-16 lg:flex lg:flex-col lg:justify-end">
          <div
            aria-hidden="true"
            className="absolute left-12 top-14 grid size-52 place-items-center rounded-full border-[3.25rem] border-primary/25"
          >
            <div className="size-12 rounded-full bg-primary" />
          </div>
          <p className="relative max-w-sm text-3xl font-semibold leading-tight tracking-[-0.04em]">
            One handle. Every rivalry. A record both players trust.
          </p>
        </section>

        <section className="flex items-center px-5 py-12 sm:px-10 lg:px-16">
          <div className="w-full max-w-lg">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Final step
            </p>
            <h1 className="mt-3 text-balance text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
              Choose how rivals find you.
            </h1>
            <p className="mt-4 max-w-md leading-7 text-muted-foreground">
              Your LeagueZero profile is separate from your sign-in account.
              Claim a unique username for requests and score confirmations.
            </p>
            <OnboardingForm
              defaultDisplayName={displayName}
              defaultUsername={username}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
