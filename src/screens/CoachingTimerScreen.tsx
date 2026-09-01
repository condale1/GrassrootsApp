import { useEffect, useRef, useState } from "react";
import {
  AppState,
  Pressable,
  StyleSheet,
  Text,
  Vibration,
  View,
} from "react-native";
import {
  advanceTimer,
  formatTimer,
  initialTimer,
  pauseTimer,
  resetTimer,
  startTimer,
  TimerMode,
  TimerSettings,
  TimerState,
} from "../lib/coachingTimer";

const defaultSettings: TimerSettings = {
  countdownSeconds: 10 * 60,
  restSeconds: 60,
  rounds: 4,
  workSeconds: 3 * 60,
};

export function CoachingTimerScreen() {
  const [mode, setMode] = useState<TimerMode>("countdown");
  const [settings, setSettings] = useState<TimerSettings>(defaultSettings);
  const [timer, setTimer] = useState<TimerState>(() =>
    initialTimer("countdown", defaultSettings),
  );
  const handledNotice = useRef(0);
  const syncTimer = () =>
    setTimer((current) => advanceTimer(current, settings, Date.now()).timer);

  useEffect(() => {
    if (timer.status !== "running") return;
    const interval = setInterval(syncTimer, 250);
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") syncTimer();
    });
    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, [settings, timer.status]);

  useEffect(() => {
    if (!timer.notice || timer.noticeId === handledNotice.current) return;
    handledNotice.current = timer.noticeId;
    Vibration.vibrate(timer.notice === "complete" ? [0, 300, 120, 300] : 220);
  }, [timer.notice, timer.noticeId]);

  const changeMode = (nextMode: TimerMode) => {
    setMode(nextMode);
    setTimer(initialTimer(nextMode, settings));
  };
  const changeSetting = (
    field: keyof TimerSettings,
    amount: number,
    minimum: number,
  ) => {
    setSettings((current) => {
      const next = {
        ...current,
        [field]: Math.max(minimum, current[field] + amount),
      };
      setTimer((existing) =>
        existing.status === "running" ? existing : resetTimer(mode, next),
      );
      return next;
    });
  };
  const reset = () => setTimer(resetTimer(mode, settings));
  const startOrResume = () =>
    setTimer((current) => startTimer(current, settings, Date.now()));
  const pause = () =>
    setTimer((current) => pauseTimer(current, settings, Date.now()));
  const active = timer.status === "running" || timer.status === "paused";
  const complete = timer.status === "complete";
  const phase = mode === "countdown" ? "COUNTDOWN" : timer.phase.toUpperCase();

  return (
    <View style={styles.container}>
      {!active && (
        <View style={styles.modeSelector}>
          <ModeButton
            active={mode === "countdown"}
            label="Countdown"
            onPress={() => changeMode("countdown")}
          />
          <ModeButton
            active={mode === "interval"}
            label="Intervals"
            onPress={() => changeMode("interval")}
          />
        </View>
      )}

      <View
        style={[
          styles.timerCard,
          timer.phase === "rest" && styles.restCard,
          complete && styles.completeCard,
        ]}
      >
        <Text style={styles.timerLabel}>
          {complete ? "ACTIVITY COMPLETE" : phase}
        </Text>
        <Text accessibilityLabel="Remaining time" style={styles.time}>
          {formatTimer(timer.remainingSeconds)}
        </Text>
        {mode === "interval" && (
          <Text style={styles.round}>
            Round {timer.round} of {settings.rounds}
          </Text>
        )}
        <Text style={styles.status}>
          {complete
            ? "Reset to run it again"
            : timer.status === "running"
              ? "Running"
              : timer.status === "paused"
                ? "Paused"
                : "Ready when you are"}
        </Text>
      </View>

      {!active && !complete && (
        <View style={styles.configCard}>
          <Text style={styles.configTitle}>
            {mode === "countdown" ? "Set countdown" : "Set intervals"}
          </Text>
          {mode === "countdown" ? (
            <>
              <Stepper
                label="Minutes"
                value={Math.floor(settings.countdownSeconds / 60).toString()}
                onDecrease={() => changeSetting("countdownSeconds", -60, 15)}
                onIncrease={() => changeSetting("countdownSeconds", 60, 15)}
              />
              <Stepper
                label="Seconds"
                value={(settings.countdownSeconds % 60)
                  .toString()
                  .padStart(2, "0")}
                onDecrease={() => changeSetting("countdownSeconds", -15, 15)}
                onIncrease={() => changeSetting("countdownSeconds", 15, 15)}
              />
            </>
          ) : (
            <>
              <Stepper
                label="Work"
                value={formatTimer(settings.workSeconds)}
                onDecrease={() => changeSetting("workSeconds", -30, 30)}
                onIncrease={() => changeSetting("workSeconds", 30, 30)}
              />
              <Stepper
                label="Rest"
                value={formatTimer(settings.restSeconds)}
                onDecrease={() => changeSetting("restSeconds", -15, 0)}
                onIncrease={() => changeSetting("restSeconds", 15, 0)}
              />
              <Stepper
                label="Rounds"
                value={settings.rounds.toString()}
                onDecrease={() => changeSetting("rounds", -1, 1)}
                onIncrease={() => changeSetting("rounds", 1, 1)}
              />
            </>
          )}
        </View>
      )}

      <View style={styles.controls}>
        {timer.status === "running" ? (
          <Pressable
            accessibilityLabel="Pause timer"
            onPress={pause}
            style={[styles.controlButton, styles.pauseButton]}
          >
            <Text style={styles.pauseText}>Pause</Text>
          </Pressable>
        ) : (
          <Pressable
            accessibilityLabel={
              timer.status === "paused" ? "Resume timer" : "Start timer"
            }
            onPress={startOrResume}
            style={styles.controlButton}
          >
            <Text style={styles.controlText}>
              {timer.status === "paused"
                ? "Resume"
                : complete
                  ? "Run again"
                  : "Start"}
            </Text>
          </Pressable>
        )}
        {(active || complete) && (
          <Pressable
            accessibilityLabel="Reset timer"
            onPress={reset}
            style={styles.resetButton}
          >
            <Text style={styles.resetText}>Reset</Text>
          </Pressable>
        )}
      </View>
      <Text style={styles.offlineText}>
        Runs fully on-device. Timing recalculates from the target time when you
        return to the app.
      </Text>
    </View>
  );
}

function ModeButton({
  active,
  label,
  onPress,
}: {
  active: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityLabel={`Select ${label} timer`}
      onPress={onPress}
      style={[styles.modeButton, active && styles.modeButtonActive]}
    >
      <Text style={[styles.modeText, active && styles.modeTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}
function Stepper({
  label,
  value,
  onDecrease,
  onIncrease,
}: {
  label: string;
  value: string;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  return (
    <View style={styles.stepper}>
      <Text style={styles.stepperLabel}>{label}</Text>
      <View style={styles.stepperControls}>
        <Pressable
          accessibilityLabel={`Decrease ${label}`}
          onPress={onDecrease}
          style={styles.stepButton}
        >
          <Text style={styles.stepButtonText}>-</Text>
        </Pressable>
        <Text style={styles.stepValue}>{value}</Text>
        <Pressable
          accessibilityLabel={`Increase ${label}`}
          onPress={onIncrease}
          style={styles.stepButton}
        >
          <Text style={styles.stepButtonText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  completeCard: { backgroundColor: "#315b34" },
  configCard: {
    backgroundColor: "#fbf8f1",
    borderColor: "#d9d1c1",
    borderRadius: 5,
    borderWidth: 1,
    gap: 4,
    padding: 16,
  },
  configTitle: {
    color: "#173a2a",
    fontFamily: "Avenir Next Condensed",
    fontSize: 25,
    fontWeight: "800",
  },
  container: { gap: 16 },
  controlButton: {
    alignItems: "center",
    backgroundColor: "#173a2a",
    borderRadius: 5,
    flex: 1,
    justifyContent: "center",
    minHeight: 62,
  },
  controlText: { color: "#ffffff", fontSize: 18, fontWeight: "800" },
  controls: { flexDirection: "row", gap: 10 },
  modeButton: {
    alignItems: "center",
    borderBottomColor: "#d9d1c1",
    borderBottomWidth: 2,
    flex: 1,
    paddingVertical: 13,
  },
  modeButtonActive: { borderBottomColor: "#f06a2f" },
  modeSelector: { flexDirection: "row", gap: 8 },
  modeText: { color: "#687365", fontSize: 14, fontWeight: "800" },
  modeTextActive: { color: "#173a2a" },
  offlineText: {
    color: "#687365",
    fontSize: 12,
    lineHeight: 17,
    textAlign: "center",
  },
  pauseButton: { backgroundColor: "#f06a2f" },
  pauseText: { color: "#ffffff", fontSize: 18, fontWeight: "800" },
  resetButton: {
    alignItems: "center",
    borderColor: "#173a2a",
    borderRadius: 5,
    borderWidth: 2,
    justifyContent: "center",
    minWidth: 105,
    paddingHorizontal: 18,
  },
  resetText: { color: "#173a2a", fontSize: 16, fontWeight: "800" },
  restCard: { backgroundColor: "#8a3f24" },
  round: { color: "#f4b08b", fontSize: 18, fontWeight: "800" },
  status: { color: "#dfe8dd", fontSize: 14, fontWeight: "700" },
  stepButton: {
    alignItems: "center",
    backgroundColor: "#e8e4d8",
    borderRadius: 4,
    height: 42,
    justifyContent: "center",
    width: 48,
  },
  stepButtonText: {
    color: "#173a2a",
    fontSize: 24,
    fontWeight: "800",
    lineHeight: 26,
  },
  stepValue: {
    color: "#173a2a",
    fontFamily: "Avenir Next Condensed",
    fontSize: 28,
    fontWeight: "800",
    minWidth: 82,
    textAlign: "center",
  },
  stepper: {
    alignItems: "center",
    borderTopColor: "#d9d1c1",
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12,
  },
  stepperControls: { alignItems: "center", flexDirection: "row", gap: 10 },
  stepperLabel: { color: "#687365", fontSize: 14, fontWeight: "800" },
  time: {
    color: "#ffffff",
    fontFamily: "Avenir Next Condensed",
    fontSize: 88,
    fontWeight: "800",
    letterSpacing: -3,
    lineHeight: 112,
    paddingTop: 8,
  },
  timerCard: {
    alignItems: "center",
    backgroundColor: "#173a2a",
    borderRadius: 5,
    gap: 3,
    paddingHorizontal: 16,
    paddingVertical: 27,
  },
  timerLabel: {
    color: "#f4b08b",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 1.8,
  },
});
