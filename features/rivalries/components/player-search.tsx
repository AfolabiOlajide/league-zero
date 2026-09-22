"use client";

import { FormEvent, useRef, useState, useTransition } from "react";
import { LoaderCircle, Search, SearchX, UsersRound, X } from "lucide-react";

import { searchPlayers } from "@/features/rivalries/actions/search-players";
import { UserSearchResult } from "@/features/rivalries/components/user-search-result";
import type { SearchUserResult } from "@/features/rivalries/types";

type PlayerSearchProps = {
  initialQuery: string;
  initialResults: SearchUserResult[];
};

export function PlayerSearch({ initialQuery, initialResults }: PlayerSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(initialQuery);
  const [submittedQuery, setSubmittedQuery] = useState(initialQuery);
  const [results, setResults] = useState(initialResults);
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();

  function updateUrl(nextQuery: string) {
    const params = new URLSearchParams();
    if (nextQuery) params.set("q", nextQuery);
    const suffix = params.size ? `?${params.toString()}` : "";
    window.history.replaceState(null, "", `/search${suffix}`);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = query.trim();
    setSubmittedQuery(nextQuery);
    setError(undefined);
    updateUrl(nextQuery);

    if (!nextQuery) {
      setResults([]);
      return;
    }

    startTransition(async () => {
      const response = await searchPlayers(nextQuery);
      setResults(response.results);
      setError(response.status === "error" ? response.message : undefined);
    });
  }

  function clearSearch() {
    setQuery("");
    setSubmittedQuery("");
    setResults([]);
    setError(undefined);
    updateUrl("");
    inputRef.current?.focus();
  }

  const hasQuery = submittedQuery.length > 0;

  return (
    <div className="mx-auto max-w-6xl animate-in fade-in-0 slide-in-from-bottom-2 duration-500 motion-reduce:animate-none">
      <section className="relative overflow-hidden rounded-3xl bg-sidebar px-6 py-7 text-sidebar-accent-foreground shadow-lg sm:px-9 sm:py-10">
        <div className="absolute -right-16 -top-20 size-64 rounded-full border border-primary/20" />
        <div className="absolute right-14 top-16 size-24 rounded-full bg-primary/10" />

        <div className="relative">
          <div className="flex items-start justify-between gap-6">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
                Player registry
              </p>
              <h1 className="mt-3 text-balance text-4xl font-semibold tracking-[-0.07em] sm:text-5xl">
                Find a player.
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-sidebar-foreground sm:text-base">
                Search a LeagueZero username to start a private head-to-head.
              </p>
            </div>
            <span className="hidden pt-1 text-right text-xs font-bold uppercase tracking-[0.16em] text-sidebar-foreground sm:block">
              Private by default
            </span>
          </div>

          <form className="mt-8 flex gap-2" role="search" onSubmit={handleSubmit}>
            <label htmlFor="player-search" className="sr-only">Search by username</label>
            <div className="relative min-w-0 flex-1">
              <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
              <input
                ref={inputRef}
                id="player-search"
                name="q"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect="off"
                placeholder="Search @username"
                className="h-13 w-full rounded-xl bg-background pl-11 pr-11 text-base text-foreground outline-none shadow-sm transition-shadow placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-primary/50"
              />
              {query ? (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                  aria-label="Clear player search"
                >
                  <X aria-hidden="true" className="size-4" />
                </button>
              ) : null}
            </div>
            <button
              type="submit"
              className="h-13 min-w-25 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground outline-none transition-transform hover:-translate-y-0.5 hover:bg-primary/85 focus-visible:ring-3 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-70"
              disabled={isPending}
            >
              {isPending ? "Searching…" : "Search"}
            </button>
          </form>
        </div>
      </section>

      <section className="mt-10" aria-labelledby="results-heading" aria-busy={isPending}>
        {hasQuery ? (
          <>
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Search results</p>
                <h2 id="results-heading" className="mt-2 text-2xl font-semibold tracking-[-0.05em]">
                  {isPending ? "Finding players" : `Matches for “${submittedQuery}”`}
                </h2>
              </div>
              <span className="text-sm text-muted-foreground">
                {isPending ? <LoaderCircle aria-label="Searching" className="size-4 animate-spin" /> : `${results.length} ${results.length === 1 ? "player" : "players"}`}
              </span>
            </div>

            {error ? (
              <p role="alert" className="mt-5 text-sm text-destructive">{error}</p>
            ) : results.length > 0 ? (
              <ul className="mt-5 space-y-1.5">{results.map((result) => <UserSearchResult key={result.id} user={result} />)}</ul>
            ) : !isPending ? (
              <div className="mt-8 max-w-lg py-5">
                <SearchX aria-hidden="true" className="size-7 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold tracking-[-0.03em]">No player found</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Check the spelling or try the username without the @ symbol.
                </p>
              </div>
            ) : null}
          </>
        ) : (
          <div className="grid gap-4 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-start">
            <span className="grid size-11 place-items-center rounded-xl bg-primary/12 text-primary">
              <UsersRound aria-hidden="true" className="size-5" />
            </span>
            <div>
              <h2 id="results-heading" className="text-xl font-semibold tracking-[-0.04em]">Search the handle they share.</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                LeagueZero records are private. A username is the only detail you need to find a player.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
