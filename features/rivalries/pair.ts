export function createPairKey(firstUserId: string, secondUserId: string): string {
  if (firstUserId === secondUserId) {
    throw new Error("A user cannot create a rivalry with themselves.");
  }

  return [firstUserId, secondUserId].sort().join(":");
}

export function canonicalParticipantIds(
  firstUserId: string,
  secondUserId: string,
): [string, string] {
  const pairKey = createPairKey(firstUserId, secondUserId);
  return pairKey.split(":") as [string, string];
}

export function isRivalryRecipient(
  participantIds: readonly string[],
  requestedBy: string,
  actorId: string,
): boolean {
  return (
    participantIds.includes(actorId) &&
    actorId !== requestedBy &&
    participantIds.includes(requestedBy)
  );
}
