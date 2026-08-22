export type TimerMode = "countdown" | "interval";
export type TimerNotice = "complete" | "transition" | null;
export type TimerPhase = "countdown" | "rest" | "work";
export type TimerSettings = { countdownSeconds: number; restSeconds: number; rounds: number; workSeconds: number };
export type TimerState = { endAt: number | null; mode: TimerMode; notice: TimerNotice; noticeId: number; phase: TimerPhase; remainingSeconds: number; round: number; status: "idle" | "paused" | "running" | "complete" };

function durationFor(settings: TimerSettings, mode: TimerMode, phase: TimerPhase) {
  if (mode === "countdown") return settings.countdownSeconds;
  return phase === "work" ? settings.workSeconds : settings.restSeconds;
}

export function initialTimer(mode: TimerMode, settings: TimerSettings): TimerState {
  const phase = mode === "countdown" ? "countdown" : "work";
  return { endAt: null, mode, notice: null, noticeId: 0, phase, remainingSeconds: durationFor(settings, mode, phase), round: 1, status: "idle" };
}

export function startTimer(timer: TimerState, settings: TimerSettings, now: number): TimerState {
  if (timer.status === "complete") return { ...initialTimer(timer.mode, settings), endAt: now + durationFor(settings, timer.mode, timer.mode === "countdown" ? "countdown" : "work") * 1000, status: "running" };
  const remainingSeconds = timer.status === "idle" ? initialTimer(timer.mode, settings).remainingSeconds : timer.remainingSeconds;
  return { ...timer, endAt: now + remainingSeconds * 1000, notice: null, remainingSeconds, status: "running" };
}

export function pauseTimer(timer: TimerState, settings: TimerSettings, now: number): TimerState {
  const progressed = advanceTimer(timer, settings, now).timer;
  return progressed.status === "running" ? { ...progressed, endAt: null, status: "paused" } : progressed;
}

export function resetTimer(mode: TimerMode, settings: TimerSettings) { return initialTimer(mode, settings); }

export function advanceTimer(timer: TimerState, settings: TimerSettings, now: number): { notice: TimerNotice; timer: TimerState } {
  if (timer.status !== "running" || timer.endAt === null) return { notice: null, timer };
  if (now < timer.endAt) return { notice: null, timer: { ...timer, remainingSeconds: Math.max(1, Math.ceil((timer.endAt - now) / 1000)) } };
  if (timer.mode === "countdown") {
    const complete = { ...timer, endAt: null, notice: "complete" as const, noticeId: timer.noticeId + 1, remainingSeconds: 0, status: "complete" as const };
    return { notice: "complete", timer: complete };
  }

  let endAt = timer.endAt;
  let phase = timer.phase;
  let round = timer.round;
  let notice: TimerNotice = "transition";
  while (endAt <= now) {
    if (phase === "work") {
      if (settings.restSeconds === 0) {
        if (round >= settings.rounds) {
          const complete = { ...timer, endAt: null, notice: "complete" as const, noticeId: timer.noticeId + 1, phase, remainingSeconds: 0, round, status: "complete" as const };
          return { notice: "complete", timer: complete };
        }
        round += 1;
        endAt += settings.workSeconds * 1000;
      } else {
        phase = "rest";
        endAt += settings.restSeconds * 1000;
      }
    } else if (round >= settings.rounds) {
      const complete = { ...timer, endAt: null, notice: "complete" as const, noticeId: timer.noticeId + 1, phase, remainingSeconds: 0, round, status: "complete" as const };
      return { notice: "complete", timer: complete };
    } else {
      phase = "work";
      round += 1;
      endAt += settings.workSeconds * 1000;
    }
  }
  const next = { ...timer, endAt, notice, noticeId: timer.noticeId + 1, phase, remainingSeconds: Math.max(1, Math.ceil((endAt - now) / 1000)), round };
  return { notice, timer: next };
}

export function formatTimer(seconds: number) {
  const safeSeconds = Math.max(0, seconds);
  return `${Math.floor(safeSeconds / 60).toString().padStart(2, "0")}:${(safeSeconds % 60).toString().padStart(2, "0")}`;
}
