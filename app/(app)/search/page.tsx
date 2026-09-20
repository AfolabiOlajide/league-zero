import { Search, SearchX, UsersRound } from "lucide-react";

import { UserSearchResult } from "@/features/rivalries/components/user-search-result";
import { searchUsersByUsername } from "@/features/rivalries/queries/rivalries";
import { getCurrentAppUser } from "@/lib/auth/get-current-app-user";

type SearchPageProps = { searchParams: Promise<{ q?: string | string[] }> };

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q : "";
  const user = await getCurrentAppUser();
  const results = user && query ? await searchUsersByUsername(user.id, query) : [];

  return (
    <div className="mx-auto max-w-3xl">
      <header className="border-b border-border pb-7">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Player search</p>
        <h1 className="mt-3 text-balance text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Find someone you play.</h1>
        <p className="mt-3 max-w-xl leading-7 text-muted-foreground">Search their LeagueZero username to start a shared head-to-head record.</p>
      </header>

      <form className="mt-7" role="search">
        <label htmlFor="player-search" className="sr-only">Search by username</label>
        <div className="flex gap-2">
          <div className="relative min-w-0 flex-1">
            <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            <input id="player-search" name="q" defaultValue={query} autoCapitalize="none" autoComplete="off" autoCorrect="off" placeholder="Username, with or without @" className="h-12 w-full rounded-lg border border-input bg-background pl-10 pr-3 text-base outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50" />
          </div>
          <button type="submit" className="h-12 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground outline-none transition-colors hover:bg-primary/80 focus-visible:ring-3 focus-visible:ring-ring/50">Search</button>
        </div>
      </form>

      {query ? (
        <section className="mt-9" aria-labelledby="results-heading">
          <div className="flex items-center justify-between gap-4 border-b border-border pb-3">
            <h2 id="results-heading" className="font-semibold">Results</h2>
            <span className="text-sm text-muted-foreground">{results.length} {results.length === 1 ? "player" : "players"}</span>
          </div>
          {results.length > 0 ? <ul>{results.map((result) => <UserSearchResult key={result.id} user={result} />)}</ul> : (
            <div className="py-14 text-center">
              <SearchX aria-hidden="true" className="mx-auto size-8 text-muted-foreground" />
              <h2 className="mt-4 font-semibold">No player found</h2>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">Try their exact LeagueZero username. You can search with or without the @ symbol.</p>
            </div>
          )}
        </section>
      ) : (
        <section className="mt-14 border-y border-border py-10">
          <UsersRound aria-hidden="true" className="size-7 text-primary" />
          <h2 className="mt-4 text-xl font-semibold">Search by the handle they share.</h2>
          <p className="mt-2 max-w-lg leading-7 text-muted-foreground">LeagueZero keeps rivalry records private. A username is the only way to find a player in this first release.</p>
        </section>
      )}
    </div>
  );
}
