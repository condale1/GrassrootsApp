import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { ageGroupGuidance, faSourceUrl } from "../data/ageGroupGuidance";

type CoachToolboxScreenProps = { ageGroup: string; setAgeGroup: (ageGroup: string) => void };

export function CoachToolboxScreen({ ageGroup, setAgeGroup }: CoachToolboxScreenProps) {
  const guidance = ageGroupGuidance.find((group) => group.age === ageGroup) ?? ageGroupGuidance[1];

  return (
    <View style={styles.container}>
      <View style={styles.introCard}>
        <Text style={styles.introTitle}>{guidance.age} football</Text>
        <Text style={styles.introText}>Choose your team once. The toolbox keeps this setting for future coach tools.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.agePicker} horizontal showsHorizontalScrollIndicator={false}>
        {ageGroupGuidance.map((group) => {
          const active = group.age === guidance.age;
          return <Pressable key={group.age} onPress={() => setAgeGroup(group.age)} style={[styles.ageButton, active ? styles.ageButtonActive : null]}><Text style={[styles.ageButtonLabel, active ? styles.ageButtonLabelActive : null]}>{group.age}</Text></Pressable>;
        })}
      </ScrollView>

      <View style={styles.summaryGrid}>
        <Metric label="Format" value={guidance.format} />
        <Metric label="Ball" value={guidance.ballSize} />
        <Metric label="Match maximum" value={`${guidance.maxMinutes} min`} />
        <Metric label="Daily maximum" value={`${guidance.dailyMinutes} min`} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pitch set-up</Text>
        <View style={styles.pitchCard}>
          <Text style={styles.pitchLabel}>Recommended playing area</Text>
          <Text style={styles.pitchSize}>{guidance.pitchRecommended}</Text>
          <View style={styles.pitchRows}>
            <PitchRow label="Minimum" value={guidance.pitchMinimum} />
            <PitchRow label="Maximum" value={guidance.pitchMaximum} />
            <PitchRow label="Goalposts" value={guidance.goalSize} />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rules to know</Text>
        <View style={styles.rulesCard}>
          {guidance.ruleNotes.map((rule) => <View key={rule} style={styles.ruleRow}><View style={styles.ruleDot} /><Text style={styles.ruleText}>{rule}</Text></View>)}
        </View>
      </View>

      <View style={styles.sourceCard}>
        <Text style={styles.sourceTitle}>England FA reference</Text>
        <Text style={styles.sourceText}>Based on the FA Future Fit 2026/27 format, pitch and equipment guide. Competition rules can add local requirements, so check your league handbook too.</Text>
        <Pressable onPress={() => void Linking.openURL(faSourceUrl)} style={styles.sourceButton}><Text style={styles.sourceButtonText}>Open FA guide</Text></Pressable>
      </View>
    </View>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <View style={styles.metric}><Text style={styles.metricLabel}>{label}</Text><Text style={styles.metricValue}>{value}</Text></View>;
}

function PitchRow({ label, value }: { label: string; value: string }) {
  return <View style={styles.pitchRow}><Text style={styles.pitchRowLabel}>{label}</Text><Text style={styles.pitchRowValue}>{value}</Text></View>;
}

const styles = StyleSheet.create({
  ageButton: { alignItems: "center", backgroundColor: "#f8f5ed", borderColor: "#d7cfbf", borderRadius: 14, borderWidth: 1, justifyContent: "center", minWidth: 50, paddingHorizontal: 12, paddingVertical: 11 },
  ageButtonActive: { backgroundColor: "#1c3825", borderColor: "#1c3825" },
  ageButtonLabel: { color: "#465345", fontSize: 14, fontWeight: "800" },
  ageButtonLabelActive: { color: "#dce8b1" },
  agePicker: { gap: 8, paddingRight: 20 },
  container: { gap: 20 },
  introCard: { backgroundColor: "#19382a", borderRadius: 14, gap: 5, padding: 20 },
  introText: { color: "#dce4d5", fontSize: 14, lineHeight: 20, marginTop: 4, maxWidth: 300 },
  introTitle: { color: "#ffffff", fontFamily: "Avenir Next Condensed", fontSize: 34, fontWeight: "800", letterSpacing: -0.8 },
  metric: { backgroundColor: "#e5ebc7", borderRadius: 10, flexGrow: 1, gap: 3, minWidth: "44%", padding: 14 },
  metricLabel: { color: "#5a6856", fontSize: 11, fontWeight: "700" },
  metricValue: { color: "#18321f", fontSize: 17, fontWeight: "800" },
  pitchCard: { backgroundColor: "#f8f5ed", borderColor: "#ded7c8", borderRadius: 12, borderWidth: 1, gap: 12, padding: 18 },
  pitchLabel: { color: "#5f6d59", fontSize: 13, fontWeight: "700" },
  pitchRow: { borderTopColor: "#ded7c8", borderTopWidth: StyleSheet.hairlineWidth, flexDirection: "row", justifyContent: "space-between", paddingTop: 10 },
  pitchRowLabel: { color: "#697166", fontSize: 13 },
  pitchRowValue: { color: "#1a2a1e", fontSize: 13, fontWeight: "800" },
  pitchRows: { gap: 10 },
  pitchSize: { color: "#1a2a1e", fontFamily: "Avenir Next Condensed", fontSize: 33, fontWeight: "800", letterSpacing: -0.8 },
  ruleDot: { backgroundColor: "#f28f3b", borderRadius: 4, height: 8, marginTop: 6, width: 8 },
  ruleRow: { flexDirection: "row", gap: 10 },
  ruleText: { color: "#29362c", flex: 1, fontSize: 14, lineHeight: 20 },
  rulesCard: { backgroundColor: "#f8f5ed", borderColor: "#ded7c8", borderRadius: 12, borderWidth: 1, gap: 12, padding: 18 },
  section: { gap: 10 },
  sectionTitle: { color: "#1a2a1e", fontFamily: "Avenir Next Condensed", fontSize: 23, fontWeight: "800", letterSpacing: -0.3 },
  sourceButton: { alignSelf: "flex-start", backgroundColor: "#dce8b1", borderRadius: 12, marginTop: 2, paddingHorizontal: 14, paddingVertical: 10 },
  sourceButtonText: { color: "#18321f", fontSize: 13, fontWeight: "800" },
  sourceCard: { backgroundColor: "#e5e1d6", borderRadius: 12, gap: 7, padding: 18 },
  sourceText: { color: "#4e594c", fontSize: 13, lineHeight: 19 },
  sourceTitle: { color: "#1a2a1e", fontSize: 16, fontWeight: "800" },
  summaryGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 }
});
