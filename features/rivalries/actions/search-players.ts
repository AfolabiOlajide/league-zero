"use server";

import type { SearchUserResult } from "@/features/rivalries/types";
import { searchUsersByUsername } from "@/features/rivalries/queries/rivalries";
import { getCurrentAppUser } from "@/lib/auth/get-current-app-user";

type PlayerSearchActionResult =
  | { status: "success"; results: SearchUserResult[] }
  | { status: "error"; message: string; results: SearchUserResult[] };

export async function searchPlayers(
  rawQuery: string,
): Promise<PlayerSearchActionResult> {
  const query = typeof rawQuery === "string" ? rawQuery.trim() : "";
  if (!query) return { status: "success", results: [] };

  const actor = await getCurrentAppUser();
  if (!actor) {
    return {
      status: "error",
      message: "Your session expired. Sign in again to search for players.",
      results: [],
    };
  }

  try {
    return {
      status: "success",
      results: await searchUsersByUsername(actor.id, query),
    };
  } catch {
    return {
      status: "error",
      message: "Player search is temporarily unavailable. Please try again.",
      results: [],
    };
  }
}
