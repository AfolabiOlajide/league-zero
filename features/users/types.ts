export type AppUser = {
  id: string;
  clerkId: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  onboardingCompletedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type OnboardingActionState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: {
    displayName?: string[];
    username?: string[];
  };
};

export type ProfileActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: {
    displayName?: string[];
    username?: string[];
  };
};

