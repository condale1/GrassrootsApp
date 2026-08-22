import { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { shareMatchdayGraphic } from "../lib/shareMatchdayGraphic";
import { MatchdayDraft, Player } from "../types";

type Props = { draft: MatchdayDraft; hasLoadedMatchday: boolean; players: Player[]; setDraft: React.Dispatch<React.SetStateAction<MatchdayDraft>> };

export function MatchdayBoardScreen({ draft, hasLoadedMatchday, players, setDraft }: Props) {
  const availablePlayers = players.filter((player) => player.available);
  const completedChecks = draft.checks.filter((check) => check.done).length;
  const date = draft.matchDate.trim() || new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", weekday: "long" }).format(new Date());
  const shareCardRef = useRef<View>(null);
  const [isSharing, setIsSharing] = useState(false);
  const updateField = (field: "focus" | "kickoff" | "matchDate" | "opponent" | "venue", value: string) => setDraft((current) => ({ ...current, [field]: value }));
  const sharePlan = async () => {
    setIsSharing(true);
    try {
      await shareMatchdayGraphic(shareCardRef);
    } finally {
      setIsSharing(false);
    }
  };

  return <View style={styles.container}>
    <View style={styles.hero}>
      <Text style={styles.date}>{date}</Text>
      <Text style={styles.heroTitle}>Matchday plan</Text>
      <Text style={styles.heroHint}>{hasLoadedMatchday ? "Everything you need before kick-off." : "Loading your saved matchday board..."}</Text>
    </View>

    <View style={styles.details}>
      <TextInput accessibilityLabel="Opponent" onChangeText={(value) => updateField("opponent", value)} placeholder="Opponent" placeholderTextColor="#7a8278" style={styles.opponentInput} value={draft.opponent} />
      <View style={styles.detailRow}><Field label="Match date" value={draft.matchDate} onChangeText={(value) => updateField("matchDate", value)} placeholder="Sat 23 Aug" /><Field label="Kick-off" value={draft.kickoff} onChangeText={(value) => updateField("kickoff", value)} placeholder="10:30" /></View>
      <Field label="Venue" value={draft.venue} onChangeText={(value) => updateField("venue", value)} placeholder="Home / away" />
    </View>

    <View style={styles.focusCard}>
      <Text style={styles.focusTitle}>Today’s focus</Text>
      <TextInput accessibilityLabel="Coaching focus" multiline onChangeText={(value) => updateField("focus", value)} placeholder="e.g. Be brave receiving the ball, then play forward." placeholderTextColor="#7b8a79" style={styles.focusInput} value={draft.focus} />
    </View>

    <View style={styles.shareSection}>
      <View collapsable={false} ref={shareCardRef} style={styles.shareCard}>
        <View style={styles.shareTop}><Text style={styles.shareBrand}>GRASSROOTS FC</Text><Text style={styles.shareDate}>{date}</Text></View>
        <Text style={styles.shareOpponent}>{draft.opponent.trim() || "Opponent to be confirmed"}</Text>
        <View style={styles.shareMeta}><Text style={styles.shareMetaItem}>{draft.kickoff.trim() || "Kick-off TBC"}</Text><Text style={styles.shareMetaItem}>{draft.venue.trim() || "Venue TBC"}</Text></View>
        <View style={styles.shareRule} />
        <Text style={styles.shareFocusLabel}>TODAY'S FOCUS</Text>
        <Text style={styles.shareFocus}>{draft.focus.trim() || "Play with confidence and enjoy the game."}</Text>
        <Text style={styles.shareSquadLabel}>SQUAD ({availablePlayers.length})</Text>
        <Text style={styles.shareSquad}>{availablePlayers.length ? availablePlayers.map((player) => player.name.trim() || "Player").join("  ·  ") : "Availability to be confirmed"}</Text>
      </View>
      <Pressable accessibilityLabel="Share match plan" disabled={isSharing} onPress={() => void sharePlan()} style={[styles.shareButton, isSharing ? styles.shareButtonDisabled : null]}><Text style={styles.shareButtonText}>{isSharing ? "Preparing image..." : "Share match plan"}</Text></Pressable>
    </View>

    <View style={styles.section}><View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Squad ready</Text><Text style={styles.count}>{availablePlayers.length} available</Text></View><View style={styles.players}>{availablePlayers.length ? availablePlayers.map((player) => <View key={player.id} style={styles.player}><Text style={styles.playerName}>{player.name.trim() || "Unnamed player"}</Text></View>) : <Text style={styles.empty}>Set player availability in Squad before the match.</Text>}</View></View>

    <View style={styles.section}><View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Before you leave</Text><Text style={styles.count}>{completedChecks}/{draft.checks.length}</Text></View><View style={styles.checklist}>{draft.checks.map((check) => <Pressable key={check.id} accessibilityRole="checkbox" accessibilityState={{ checked: check.done }} onPress={() => setDraft((current) => ({ ...current, checks: current.checks.map((item) => item.id === check.id ? { ...item, done: !item.done } : item) }))} style={styles.check}><View style={[styles.box, check.done ? styles.boxDone : null]}>{check.done ? <Text style={styles.tick}>✓</Text> : null}</View><Text style={[styles.checkLabel, check.done ? styles.checkLabelDone : null]}>{check.label}</Text></Pressable>)}</View></View>
  </View>;
}

function Field({ label, onChangeText, placeholder, value }: { label: string; onChangeText: (value: string) => void; placeholder: string; value: string }) {
  return <View style={styles.field}><Text style={styles.fieldLabel}>{label}</Text><TextInput accessibilityLabel={label} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor="#7a8278" style={styles.fieldInput} value={value} /></View>;
}

const styles = StyleSheet.create({
  box: { alignItems: "center", borderColor: "#90a182", borderRadius: 4, borderWidth: 1.5, height: 22, justifyContent: "center", width: 22 },
  boxDone: { backgroundColor: "#dce8b1", borderColor: "#dce8b1" },
  check: { alignItems: "center", flexDirection: "row", gap: 11, paddingVertical: 12 },
  checkLabel: { color: "#25362a", flex: 1, fontSize: 15, fontWeight: "700" },
  checkLabelDone: { color: "#6b7568", textDecorationLine: "line-through" },
  checklist: { backgroundColor: "#f8f5ed", borderColor: "#ded7c8", borderRadius: 12, borderWidth: 1, paddingHorizontal: 16 },
  container: { gap: 22 },
  count: { color: "#557151", fontSize: 12, fontWeight: "800" },
  date: { color: "#dce8b1", fontSize: 13, fontWeight: "700" },
  detailRow: { flexDirection: "row", gap: 12 },
  details: { backgroundColor: "#f8f5ed", borderColor: "#ded7c8", borderRadius: 12, borderWidth: 1, gap: 14, padding: 16 },
  empty: { color: "#667061", fontSize: 14, lineHeight: 20 },
  field: { flex: 1, gap: 3 },
  fieldInput: { borderBottomColor: "#d5cebf", borderBottomWidth: 1, color: "#1a2a1e", fontSize: 16, fontWeight: "800", paddingBottom: 6, paddingHorizontal: 0, paddingTop: 2 },
  fieldLabel: { color: "#667061", fontSize: 12, fontWeight: "700" },
  focusCard: { backgroundColor: "#e5ebc7", borderRadius: 12, gap: 7, padding: 17 },
  focusInput: { color: "#1f3524", fontSize: 16, fontWeight: "600", lineHeight: 22, minHeight: 52, padding: 0, textAlignVertical: "top" },
  focusTitle: { color: "#29482b", fontSize: 15, fontWeight: "800" },
  hero: { backgroundColor: "#19382a", borderRadius: 14, gap: 4, padding: 20 },
  heroHint: { color: "#d7e2d4", fontSize: 13, lineHeight: 19 },
  heroTitle: { color: "#ffffff", fontFamily: "Avenir Next Condensed", fontSize: 36, fontWeight: "800", letterSpacing: -0.7 },
  opponentInput: { color: "#1a2a1e", fontFamily: "Avenir Next Condensed", fontSize: 28, fontWeight: "800", letterSpacing: -0.4, padding: 0 },
  player: { backgroundColor: "#e5ebc7", borderRadius: 8, paddingHorizontal: 11, paddingVertical: 8 },
  playerName: { color: "#264226", fontSize: 13, fontWeight: "800" },
  players: { flexDirection: "row", flexWrap: "wrap", gap: 7 },
  section: { gap: 10 },
  sectionHeader: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  sectionTitle: { color: "#1a2a1e", fontFamily: "Avenir Next Condensed", fontSize: 23, fontWeight: "800", letterSpacing: -0.3 },
  shareBrand: { color: "#dce8b1", fontSize: 11, fontWeight: "900", letterSpacing: 1.4 },
  shareButton: { alignItems: "center", backgroundColor: "#19382a", borderRadius: 9, paddingVertical: 13 },
  shareButtonDisabled: { opacity: 0.65 },
  shareButtonText: { color: "#ffffff", fontSize: 14, fontWeight: "800" },
  shareCard: { backgroundColor: "#19382a", borderRadius: 12, gap: 8, padding: 20 },
  shareDate: { color: "#d9e1d4", fontSize: 11, fontWeight: "700" },
  shareFocus: { color: "#ffffff", fontSize: 16, fontWeight: "700", lineHeight: 22 },
  shareFocusLabel: { color: "#dce8b1", fontSize: 10, fontWeight: "900", letterSpacing: 1.2, marginTop: 4 },
  shareMeta: { flexDirection: "row", gap: 8 },
  shareMetaItem: { backgroundColor: "#31543a", color: "#ffffff", flex: 1, fontSize: 12, fontWeight: "700", paddingHorizontal: 9, paddingVertical: 7, textAlign: "center" },
  shareOpponent: { color: "#ffffff", fontFamily: "Avenir Next Condensed", fontSize: 32, fontWeight: "800", letterSpacing: -0.5 },
  shareRule: { backgroundColor: "#dce8b1", height: 3, marginVertical: 3, width: 42 },
  shareSection: { gap: 8 },
  shareSquad: { color: "#d9e1d4", fontSize: 12, fontWeight: "600", lineHeight: 18 },
  shareSquadLabel: { color: "#dce8b1", fontSize: 10, fontWeight: "900", letterSpacing: 1.2, marginTop: 4 },
  shareTop: { flexDirection: "row", justifyContent: "space-between" },
  tick: { color: "#18321f", fontSize: 15, fontWeight: "900" }
});
