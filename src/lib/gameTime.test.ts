import { describe, expect, it } from "@jest/globals";

import { createGameTimePlan } from "./gameTime";

describe("createGameTimePlan", () => {
  it("allocates the full pitch-time budget and keeps equal rotations close", () => {
    const plan = createGameTimePlan({ forceEqualTime: true, matchMinutes: 50, playersOnPitch: 5, rotationMinutes: 10, squadSize: 7 });
    expect(plan.minutesByPlayer.reduce((total, minutes) => total + minutes, 0)).toBe(250);
    expect(Math.max(...plan.minutesByPlayer) - Math.min(...plan.minutesByPlayer)).toBeLessThanOrEqual(10);
    expect(plan.targetMinutes).toBeCloseTo(250 / 7);
  });

  it("adds a mid-period rotation when a sub-during-play point is supplied", () => {
    const plan = createGameTimePlan({ extraRotationMinutes: [45], matchMinutes: 50, playersOnPitch: 5, rotationMinutes: 10, squadSize: 7 });
    expect(plan.periods.map((period) => [period.start, period.end])).toEqual([[0, 10], [10, 20], [20, 30], [30, 40], [40, 45], [45, 50]]);
  });

  it("ignores duplicate or out-of-range extra rotation points", () => {
    const plan = createGameTimePlan({ extraRotationMinutes: [-1, 25, 25, 50], matchMinutes: 50, playersOnPitch: 5, rotationMinutes: 10, squadSize: 6 });
    expect(plan.periods.map((period) => period.end)).toEqual([10, 20, 25, 35, 45, 50]);
  });
});
