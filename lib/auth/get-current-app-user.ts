import "server-only";

import { auth } from "@clerk/nextjs/server";

import { getUserByClerkId } from "@/features/users/queries/get-user-by-clerk-id";

export async function getCurrentAppUser() {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated || !userId) {
    return null;
  }

  return getUserByClerkId(userId);
}
