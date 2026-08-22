import { advanceTimer, formatTimer, initialTimer, pauseTimer, startTimer, TimerSettings } from "./coachingTimer";

const settings: TimerSettings = { countdownSeconds: 90, workSeconds: 30, restSeconds: 10, rounds: 2 };

describe("coaching timer", () => {
  it("calculates countdown time from its target timestamp", () => {
    const running = startTimer(initialTimer("countdown", settings), settings, 1_000);
    expect(advanceTimer(running, settings, 31_100).timer.remainingSeconds).toBe(60);
  });

  it("retains the accurate remaining time when paused", () => {
    const running = startTimer(initialTimer("countdown", settings), settings, 1_000);
    const paused = pauseTimer(running, settings, 21_400);
    expect(paused).toMatchObject({ remainingSeconds: 70, status: "paused" });
  });

  it("moves an interval timer from work into rest and then the next round", () => {
    const running = startTimer(initialTimer("interval", settings), settings, 1_000);
    const rest = advanceTimer(running, settings, 31_000).timer;
    expect(rest).toMatchObject({ phase: "rest", remainingSeconds: 10, round: 1, status: "running" });
    const work = advanceTimer(rest, settings, 41_000).timer;
    expect(work).toMatchObject({ phase: "work", remainingSeconds: 30, round: 2, status: "running" });
  });

  it("completes the final interval and formats time", () => {
    const running = startTimer(initialTimer("interval", settings), settings, 1_000);
    expect(advanceTimer(running, settings, 81_000).timer.status).toBe("complete");
    expect(formatTimer(65)).toBe("01:05");
  });
});
