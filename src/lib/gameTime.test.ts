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
    expect(plan.periods.map((period) => period.end)).toEqual([10, 20, 25, 30, 40, 50]);
  });

  it("can achieve exact equality by adding requested mid-rotation substitutions", () => {
    const plan = createGameTimePlan({ extraRotationMinutes: [5, 15, 25, 35], forceEqualTime: true, matchMinutes: 40, playersOnPitch: 5, rotationMinutes: 10, squadSize: 8 });
    expect(plan.minutesByPlayer).toEqual(Array.from({ length: 8 }, () => 25));
  });

  it("uses a requested starting player to vary the opening group", () => {
    const plan = createGameTimePlan({ forceEqualTime: true, matchMinutes: 40, playersOnPitch: 5, rotationMinutes: 10, squadSize: 8, startingPlayer: 3 });
    expect(plan.periods[0].players).toEqual([3, 4, 5, 6, 7]);
  });
});
