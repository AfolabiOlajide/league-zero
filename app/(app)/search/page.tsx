import { PlayerSearch } from "@/features/rivalries/components/player-search";
import { searchUsersByUsername } from "@/features/rivalries/queries/rivalries";
import { getCurrentAppUser } from "@/lib/auth/get-current-app-user";

type SearchPageProps = { searchParams: Promise<{ q?: string | string[] }> };

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q : "";
  const user = await getCurrentAppUser();
  const results = user && query ? await searchUsersByUsername(user.id, query) : [];

  return <PlayerSearch initialQuery={query} initialResults={results} />;
}
