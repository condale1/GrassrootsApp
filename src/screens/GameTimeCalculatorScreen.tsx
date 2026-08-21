import { useState } from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";

import { createGameTimePlan } from "../lib/gameTime";
import { Player } from "../types";

type InputId = "matchMinutes" | "playersOnPitch" | "rotationMinutes";

const limits: Record<InputId, { maximum: number; minimum: number; step: number }> = {
  matchMinutes: { minimum: 10, maximum: 120, step: 5 },
  playersOnPitch: { minimum: 3, maximum: 11, step: 1 },
  rotationMinutes: { minimum: 5, maximum: 30, step: 5 }
};

export function GameTimeCalculatorScreen({ players }: { players: Player[] }) {
  const [forceEqualTime, setForceEqualTime] = useState(true);
  const [subDuringPlay, setSubDuringPlay] = useState(false);
  const [matchMinutes, setMatchMinutes] = useState(50);
  const [playersOnPitch, setPlayersOnPitch] = useState(5);
  const [rotationMinutes, setRotationMinutes] = useState(10);
  const availablePlayers = players.filter((player) => player.available);
  const activePlayersOnPitch = Math.min(playersOnPitch, availablePlayers.length);
  const canCreatePlan = availablePlayers.length >= 3;
  const plan = canCreatePlan ? createGameTimePlan({
    extraRotationMinutes: subDuringPlay ? [matchMinutes - 5] : [],
    forceEqualTime,
    matchMinutes,
    squadSize: availablePlayers.length,
    playersOnPitch: activePlayersOnPitch,
    rotationMinutes
  }) : null;
  const spread = plan ? Math.max(...plan.minutesByPlayer) - Math.min(...plan.minutesByPlayer) : 0;

  const changeValue = (id: InputId, direction: -1 | 1) => {
    const limit = limits[id];
    const current = id === "playersOnPitch" ? activePlayersOnPitch : id === "matchMinutes" ? matchMinutes : rotationMinutes;
    const next = Math.min(limit.maximum, Math.max(limit.minimum, current + limit.step * direction));
    if (id === "matchMinutes") setMatchMinutes(next);
    if (id === "rotationMinutes") setRotationMinutes(next);
    if (id === "playersOnPitch") setPlayersOnPitch(Math.min(next, Math.max(availablePlayers.length, 3)));
  };

  return (
    <View style={styles.container}>
      <View style={styles.availabilityStrip}>
        <Text style={styles.availabilityValue}>{availablePlayers.length}</Text>
        <Text style={styles.availabilityText}>available players from your saved squad</Text>
      </View>
      <View style={styles.settingsCard}>
        <Stepper label="Match length" value={`${matchMinutes} min`} onDecrease={() => changeValue("matchMinutes", -1)} onIncrease={() => changeValue("matchMinutes", 1)} />
        <Stepper label="On the pitch" value={`${activePlayersOnPitch}`} onDecrease={() => changeValue("playersOnPitch", -1)} onIncrease={() => changeValue("playersOnPitch", 1)} />
        <Stepper label="Rotate every" value={`${rotationMinutes} min`} onDecrease={() => changeValue("rotationMinutes", -1)} onIncrease={() => changeValue("rotationMinutes", 1)} />
        <View style={styles.toggleRow}>
          <View style={styles.toggleCopy}><Text style={styles.toggleTitle}>Force equal time</Text><Text style={styles.toggleHint}>Prioritise players with the lowest planned minutes.</Text></View>
          <Switch accessibilityLabel="Force equal time" onValueChange={setForceEqualTime} trackColor={{ false: "#b9b4a9", true: "#78925d" }} value={forceEqualTime} />
        </View>
        <View style={styles.toggleRow}>
          <View style={styles.toggleCopy}><Text style={styles.toggleTitle}>Sub during play</Text><Text style={styles.toggleHint}>Adds a final 5-minute switch to close small game-time gaps.</Text></View>
          <Switch accessibilityLabel="Sub during play" onValueChange={setSubDuringPlay} trackColor={{ false: "#b9b4a9", true: "#78925d" }} value={subDuringPlay} />
        </View>
      </View>
      {plan ? <Plan forceEqualTime={forceEqualTime} plan={plan} availablePlayers={availablePlayers} spread={spread} /> : <EmptyPlan />}
    </View>
  );
}

type PlanProps = { availablePlayers: Player[]; forceEqualTime: boolean; plan: ReturnType<typeof createGameTimePlan>; spread: number };

function Plan({ availablePlayers, forceEqualTime, plan, spread }: PlanProps) {
  return <><View style={styles.resultCard}><View style={styles.resultHeader}><View><Text style={styles.resultTitle}>{forceEqualTime ? "Fair game time" : "Rotation plan"}</Text><Text style={styles.target}>{plan.targetMinutes.toFixed(1)} min</Text><Text style={styles.targetCaption}>{forceEqualTime ? "average planned time" : "average scheduled time"}</Text></View><View style={styles.fairnessBadge}><Text style={styles.fairnessValue}>{spread} min</Text><Text style={styles.fairnessLabel}>maximum gap</Text></View></View><Text style={styles.resultText}>{forceEqualTime ? "Players with the lowest scheduled time are selected first at every rotation." : "Players rotate in squad order. Turn on equal time to make the allocation fairer."}</Text></View><View style={styles.section}><Text style={styles.sectionTitle}>Player allocation</Text><View style={styles.allocationGrid}>{plan.minutesByPlayer.map((minutes, index) => <View key={availablePlayers[index].id} style={styles.playerChip}><Text numberOfLines={1} style={styles.playerName}>{availablePlayers[index].name.trim() || `Player ${index + 1}`}</Text><Text style={styles.playerMinutes}>{minutes} min</Text></View>)}</View></View><View style={styles.section}><Text style={styles.sectionTitle}>Rotation plan</Text><Text style={styles.sectionHint}>Use each row as your on-pitch group for that block.</Text><View style={styles.schedule}>{plan.periods.map((period) => <View key={period.start} style={styles.period}><Text style={styles.periodTime}>{period.start}'-{period.end}'</Text><Text style={styles.periodPlayers}>{period.players.map((player) => availablePlayers[player].name.trim() || `Player ${player + 1}`).join("  |  ")}</Text></View>)}</View></View></>;
}

function EmptyPlan() { return <View style={styles.noticeCard}><Text style={styles.noticeTitle}>Set your match-day squad first</Text><Text style={styles.noticeText}>Go to the Squad tab and mark at least 3 players as available to create a rotation plan.</Text></View>; }
function Stepper({ label, value, onDecrease, onIncrease }: { label: string; onDecrease: () => void; onIncrease: () => void; value: string }) { return <View style={styles.stepper}><Text style={styles.stepperLabel}>{label}</Text><View style={styles.stepperControls}><Pressable accessibilityLabel={`Decrease ${label}`} onPress={onDecrease} style={styles.stepperButton}><Text style={styles.stepperButtonText}>-</Text></Pressable><Text style={styles.stepperValue}>{value}</Text><Pressable accessibilityLabel={`Increase ${label}`} onPress={onIncrease} style={styles.stepperButton}><Text style={styles.stepperButtonText}>+</Text></Pressable></View></View>; }

const styles = StyleSheet.create({
  allocationGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 }, availabilityStrip: { alignItems: "center", backgroundColor: "#e5ebc7", borderRadius: 12, flexDirection: "row", gap: 10, padding: 15 }, availabilityText: { color: "#375134", flex: 1, fontSize: 13, fontWeight: "700" }, availabilityValue: { color: "#18321f", fontFamily: "Avenir Next Condensed", fontSize: 31, fontWeight: "800" }, container: { gap: 22 }, fairnessBadge: { alignItems: "flex-end", gap: 2 }, fairnessLabel: { color: "#d0d9c3", fontSize: 11 }, fairnessValue: { color: "#ffffff", fontSize: 18, fontWeight: "800" }, noticeCard: { backgroundColor: "#f8f5ed", borderColor: "#ded7c8", borderRadius: 12, borderWidth: 1, gap: 4, padding: 18 }, noticeText: { color: "#626d60", fontSize: 14, lineHeight: 20 }, noticeTitle: { color: "#1a2a1e", fontSize: 16, fontWeight: "800" }, period: { borderBottomColor: "#ded7c8", borderBottomWidth: StyleSheet.hairlineWidth, flexDirection: "row", gap: 16, paddingVertical: 13 }, periodPlayers: { color: "#1a2a1e", flex: 1, fontSize: 14, fontWeight: "700", lineHeight: 20 }, periodTime: { color: "#6c7566", fontSize: 13, fontWeight: "700", width: 58 }, playerChip: { backgroundColor: "#e5ebc7", borderRadius: 9, gap: 2, minWidth: "30%", paddingHorizontal: 12, paddingVertical: 10 }, playerMinutes: { color: "#18321f", fontSize: 16, fontWeight: "800" }, playerName: { color: "#5a6856", fontSize: 11, fontWeight: "700" }, resultCard: { backgroundColor: "#19382a", borderRadius: 14, gap: 14, padding: 20 }, resultHeader: { alignItems: "flex-start", flexDirection: "row", justifyContent: "space-between" }, resultText: { color: "#dce4d5", fontSize: 14, lineHeight: 20, maxWidth: 310 }, resultTitle: { color: "#dce8b1", fontSize: 15, fontWeight: "800" }, schedule: { backgroundColor: "#f8f5ed", borderRadius: 12, paddingHorizontal: 16 }, section: { gap: 10 }, sectionHint: { color: "#626d60", fontSize: 14, lineHeight: 20 }, sectionTitle: { color: "#1a2a1e", fontFamily: "Avenir Next Condensed", fontSize: 23, fontWeight: "800", letterSpacing: -0.3 }, settingsCard: { backgroundColor: "#f8f5ed", borderColor: "#ded7c8", borderRadius: 12, borderWidth: 1, gap: 2, padding: 18 }, stepper: { alignItems: "center", borderBottomColor: "#ded7c8", borderBottomWidth: StyleSheet.hairlineWidth, flexDirection: "row", justifyContent: "space-between", paddingVertical: 14 }, stepperButton: { alignItems: "center", backgroundColor: "#e5ebc7", borderRadius: 9, height: 36, justifyContent: "center", width: 36 }, stepperButtonText: { color: "#18321f", fontSize: 21, fontWeight: "700", lineHeight: 23 }, stepperControls: { alignItems: "center", flexDirection: "row", gap: 10 }, stepperLabel: { color: "#26352a", fontSize: 15, fontWeight: "700" }, stepperValue: { color: "#18321f", fontSize: 14, fontWeight: "800", minWidth: 54, textAlign: "center" }, target: { color: "#ffffff", fontFamily: "Avenir Next Condensed", fontSize: 38, fontWeight: "800", letterSpacing: -1 }, targetCaption: { color: "#d0d9c3", fontSize: 12, marginTop: -2 }, toggleCopy: { flex: 1, gap: 2 }, toggleHint: { color: "#687164", fontSize: 12, lineHeight: 17, maxWidth: 240 }, toggleRow: { alignItems: "center", flexDirection: "row", gap: 16, paddingTop: 14 }, toggleTitle: { color: "#26352a", fontSize: 15, fontWeight: "800" }
});
