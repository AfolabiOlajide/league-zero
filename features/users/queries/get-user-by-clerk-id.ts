import "server-only";

import { connectToDatabase } from "@/lib/db/connect";
import { UserModel } from "@/models/user";

import type { AppUser } from "../types";

type UserRecord = {
  _id: { toString(): string };
  clerkId: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  onboardingCompletedAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

function toAppUser(user: UserRecord): AppUser {
  return {
    id: user._id.toString(),
    clerkId: user.clerkId,
    username: user.username,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl,
    onboardingCompletedAt: user.onboardingCompletedAt.toISOString(),
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

export async function getUserByClerkId(
  clerkId: string,
): Promise<AppUser | null> {
  await connectToDatabase();

  const user = await UserModel.findOne({ clerkId })
    .select({
      clerkId: 1,
      username: 1,
      displayName: 1,
      avatarUrl: 1,
      onboardingCompletedAt: 1,
      createdAt: 1,
      updatedAt: 1,
    })
    .lean<UserRecord>()
    .exec();

  return user ? toAppUser(user) : null;
}
