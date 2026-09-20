export function canDecideMatch(participantIds: readonly string[], submittedBy: string, actorId: string) {
  return participantIds.includes(actorId) && actorId !== submittedBy;
}

export function alignScores(participantIds: readonly string[], actorId: string, myScore: number, opponentScore: number): [number, number] {
  if (participantIds.length !== 2 || !participantIds.includes(actorId)) throw new Error("Actor is not a match participant.");
  return participantIds[0] === actorId ? [myScore, opponentScore] : [opponentScore, myScore];
}
