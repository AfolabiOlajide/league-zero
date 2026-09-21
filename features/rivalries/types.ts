export type RivalryStatus = "pending" | "active" | "rejected" | "cancelled";

export type RivalryActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export type RivalryParticipant = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
};

export type RivalrySummary = {
  id: string;
  status: RivalryStatus;
  requestedBy: string;
  participant: RivalryParticipant;
  createdAt: string;
  updatedAt: string;
};

export type SearchUserResult = RivalryParticipant & {
  rivalry?: { id: string; status: RivalryStatus; requestedBy: string };
};

export type RivalryDetail = {
  id: string;
  status: RivalryStatus;
  requestedBy: string;
  participants: [RivalryParticipant, RivalryParticipant];
  createdAt: string;
};
