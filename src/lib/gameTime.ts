export type RotationPeriod = {
  end: number;
  players: number[];
  start: number;
};

export type GameTimePlan = {
  minutesByPlayer: number[];
  periods: RotationPeriod[];
  targetMinutes: number;
};

type GameTimeOptions = {
  extraRotationMinutes?: number[];
  forceEqualTime?: boolean;
  matchMinutes: number;
  playersOnPitch: number;
  rotationMinutes: number;
  startingPlayer?: number;
  squadSize: number;
};

export function createGameTimePlan({
  extraRotationMinutes,
  forceEqualTime = true,
  matchMinutes,
  playersOnPitch,
  rotationMinutes,
  startingPlayer = 0,
  squadSize
}: GameTimeOptions): GameTimePlan {
  const minutesByPlayer = Array.from({ length: squadSize }, () => 0);
  const periods: RotationPeriod[] = [];
  let rotationCursor = ((startingPlayer % squadSize) + squadSize) % squadSize;
  const extraRotationPoints = [...new Set(extraRotationMinutes ?? [])]
    .filter((minute) => minute > 0 && minute < matchMinutes)
    .sort((left, right) => left - right);
  const rotationPoints = [...new Set([
    0,
    matchMinutes,
    ...Array.from({ length: Math.ceil(matchMinutes / rotationMinutes) - 1 }, (_, index) => (index + 1) * rotationMinutes),
    ...extraRotationPoints
  ])].sort((left, right) => left - right);

  for (let periodIndex = 0; periodIndex < rotationPoints.length - 1; periodIndex += 1) {
    const start = rotationPoints[periodIndex];
    const end = rotationPoints[periodIndex + 1];
    const duration = end - start;
    const eligiblePlayers = Array.from({ length: squadSize }, (_, index) => index);
    const playerOrder = eligiblePlayers.sort((left, right) => {
      if (forceEqualTime) {
        const minuteDifference = minutesByPlayer[left] - minutesByPlayer[right];

        if (minuteDifference !== 0) return minuteDifference;
      }

      return (left - rotationCursor + squadSize) % squadSize - ((right - rotationCursor + squadSize) % squadSize);
    });
    const players = playerOrder.slice(0, Math.min(playersOnPitch, eligiblePlayers.length));

    players.forEach((player) => {
      minutesByPlayer[player] += duration;
    });
    periods.push({ start, end, players });
    rotationCursor = (rotationCursor + players.length) % squadSize;
  }

  return {
    minutesByPlayer,
    periods,
    targetMinutes: minutesByPlayer.reduce((total, minutes) => total + minutes, 0) / squadSize
  };
}
