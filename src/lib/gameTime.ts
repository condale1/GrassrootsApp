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
  squadSize: number;
};

export function createGameTimePlan({
  extraRotationMinutes,
  forceEqualTime = true,
  matchMinutes,
  playersOnPitch,
  rotationMinutes,
  squadSize
}: GameTimeOptions): GameTimePlan {
  const minutesByPlayer = Array.from({ length: squadSize }, () => 0);
  const periods: RotationPeriod[] = [];
  let rotationCursor = 0;
  let start = 0;
  const extraRotationPoints = [...new Set(extraRotationMinutes ?? [])]
    .filter((minute) => minute > 0 && minute < matchMinutes)
    .sort((left, right) => left - right);

  while (start < matchMinutes) {
    const nextRotation = Math.min(start + rotationMinutes, matchMinutes);
    const extraRotation = extraRotationPoints.find((minute) => minute > start && minute < nextRotation);
    const end = extraRotation ?? nextRotation;
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
    start = end;
  }

  return {
    minutesByPlayer,
    periods,
    targetMinutes: minutesByPlayer.reduce((total, minutes) => total + minutes, 0) / squadSize
  };
}
