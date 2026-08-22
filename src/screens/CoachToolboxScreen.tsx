import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { AgeGroupGuidance, faGuidanceVersion, findAgeGroupGuidance, Formation, pitchDiagonal } from "../data/ageGroupGuidance";

type ToolboxSection = "overview" | "pitch" | "rules" | "equipment" | "formations" | "matchday" | "next";
type CoachToolboxScreenProps = { ageGroup: string; setAgeGroup: (ageGroup: string) => void };

const sections: { id: ToolboxSection; label: string }[] = [
  { id: "overview", label: "Overview" }, { id: "pitch", label: "Pitch setup" }, { id: "rules", label: "Rules" }, { id: "equipment", label: "Equipment" }, { id: "formations", label: "Formations" }, { id: "matchday", label: "Matchday kit" }, { id: "next", label: "Next age" }
];

export function CoachToolboxScreen({ ageGroup, setAgeGroup }: CoachToolboxScreenProps) {
  const [section, setSection] = useState<ToolboxSection>("overview");
  const guidance = findAgeGroupGuidance(ageGroup);

  return <View style={styles.container}>
    <View style={styles.introCard}>
      <Text style={styles.introTitle}>{guidance.age} reference</Text>
      <Text style={styles.introText}>Your selected age group stays active across every Toolbox reference.</Text>
      <Text style={styles.version}>{faGuidanceVersion}</Text>
    </View>

    <ScrollView contentContainerStyle={styles.agePicker} horizontal showsHorizontalScrollIndicator={false}>
      {Array.from({ length: 12 }, (_, index) => `U${index + 7}`).map((age) => <Pressable accessibilityLabel={`Select ${age}`} key={age} onPress={() => setAgeGroup(age)} style={[styles.ageButton, age === guidance.age && styles.ageButtonActive]}><Text style={[styles.ageButtonLabel, age === guidance.age && styles.ageButtonLabelActive]}>{age}</Text></Pressable>)}
    </ScrollView>

    <View style={styles.sectionNav}>{sections.map((item) => <Pressable accessibilityLabel={`Open ${item.label}`} key={item.id} onPress={() => setSection(item.id)} style={[styles.sectionButton, section === item.id && styles.sectionButtonActive]}><Text style={[styles.sectionButtonText, section === item.id && styles.sectionButtonTextActive]}>{item.label}</Text></Pressable>)}</View>

    {section === "overview" && <Overview guidance={guidance} />}
    {section === "pitch" && <PitchSetup guidance={guidance} />}
    {section === "rules" && <Rules guidance={guidance} />}
    {section === "equipment" && <Equipment guidance={guidance} />}
    {section === "formations" && <Formations guidance={guidance} />}
    {section === "matchday" && <MatchdayEquipment guidance={guidance} />}
    {section === "next" && <NextAge guidance={guidance} />}
  </View>;
}

function Overview({ guidance }: { guidance: AgeGroupGuidance }) {
  return <View style={styles.section}>
    <Text style={styles.sectionTitle}>At a glance</Text>
    <View style={styles.summaryGrid}><Metric label="Format" value={guidance.format} /><Metric label="Players" value={`${guidance.format} per side`} /><Metric label="Ball" value={guidance.ballSize} /><Metric label="Goal" value={guidance.goalSize} /><Metric label="Match duration" value={guidance.matchDuration} /><Metric label="Daily guidance" value={`Up to ${guidance.dailyMinutes} min`} /></View>
    <View style={styles.referenceCard}><Text style={styles.cardLabel}>Recommended playing area</Text><Text style={styles.pitchSize}>{guidance.pitchRecommended}</Text><Text style={styles.cardText}>Use your league's competition rules where they set a different permitted range.</Text></View>
  </View>;
}

function PitchSetup({ guidance }: { guidance: AgeGroupGuidance }) {
  const diagonal = pitchDiagonal(guidance.pitchLength, guidance.pitchWidth);
  return <View style={styles.section}>
    <Text style={styles.sectionTitle}>Pitch setup</Text>
    <PitchDiagram guidance={guidance} />
    <View style={styles.referenceCard}><Text style={styles.cardLabel}>Recommended size</Text><Text style={styles.pitchSize}>{guidance.pitchRecommended}</Text><Row label="Goal area" value={guidance.goalArea} /><Row label="Minimum" value={guidance.pitchMinimum} /><Row label="Maximum" value={guidance.pitchMaximum} /><Row label="Approx. diagonal" value={`${diagonal.toFixed(1)}m`} /></View>
    <View style={styles.noteCard}><Text style={styles.noteTitle}>Mark it square</Text><Text style={styles.cardText}>Measure both corner-to-corner diagonals. If they match, the rectangle is square. Pace-counting is only an approximation; use a tape or measuring wheel where possible.</Text></View>
    <View style={styles.referenceCard}><Text style={styles.cardLabel}>Markings to include</Text>{guidance.markings.map((marking) => <Bullet key={marking} text={marking} />)}</View>
  </View>;
}

function Rules({ guidance }: { guidance: AgeGroupGuidance }) {
  return <View style={styles.section}><Text style={styles.sectionTitle}>Rules quick reference</Text><Text style={styles.hint}>A matchday reminder, not a replacement for your competition handbook.</Text><View style={styles.ruleList}>{guidance.rules.map((rule) => <View key={rule.label} style={styles.ruleCard}><Text style={styles.ruleLabel}>{rule.label}</Text><Text style={styles.ruleText}>{rule.detail}</Text></View>)}</View></View>;
}

function Equipment({ guidance }: { guidance: AgeGroupGuidance }) {
  return <View style={styles.section}><Text style={styles.sectionTitle}>Equipment reference</Text><View style={styles.summaryGrid}><Metric label="Match ball" value={guidance.ballSize} /><Metric label="Goal size" value={guidance.goalSize} /><Metric label="Goalkeeper" value={guidance.hasGoalkeeper ? "Required" : "Not used"} /></View><View style={styles.referenceCard}><Text style={styles.cardLabel}>Set-up essentials</Text>{guidance.equipment.slice(0, 5).map((item) => <Bullet key={item} text={item} />)}</View></View>;
}

function Formations({ guidance }: { guidance: AgeGroupGuidance }) {
  return <View style={styles.section}><Text style={styles.sectionTitle}>Formation guidance</Text><Text style={styles.hint}>These are suggestions, not requirements. Rotate roles and adapt the picture to your players.</Text>{guidance.formations.map((formation) => <View key={formation.name} style={styles.formationCard}><Text style={styles.formationName}>{formation.name}</Text><FormationDiagram formation={formation} /><Text style={styles.cardText}>{formation.description}</Text></View>)}</View>;
}

function MatchdayEquipment({ guidance }: { guidance: AgeGroupGuidance }) {
  return <View style={styles.section}><Text style={styles.sectionTitle}>Matchday equipment</Text><Text style={styles.hint}>A practical pack-up list for {guidance.age}.</Text><View style={styles.checklist}>{guidance.equipment.map((item) => <View key={item} style={styles.checkRow}><View style={styles.checkBox} /><Text style={styles.checkText}>{item}</Text></View>)}</View><View style={styles.noteCard}><Text style={styles.noteTitle}>Safety first</Text><Text style={styles.cardText}>Portable goals must be anchored or weighted before players use them. Keep spectators in the designated area and keep a clear run-off around the pitch.</Text></View></View>;
}

function NextAge({ guidance }: { guidance: AgeGroupGuidance }) {
  const age = Number.parseInt(guidance.age.slice(1), 10);
  if (age >= 18) return <View style={styles.section}><Text style={styles.sectionTitle}>Next age group</Text><View style={styles.noteCard}><Text style={styles.noteTitle}>Youth pathway complete</Text><Text style={styles.cardText}>This is the final age group in this offline reference.</Text></View></View>;
  const next = findAgeGroupGuidance(`U${age + 1}`);
  return <View style={styles.section}><Text style={styles.sectionTitle}>Moving into {next.age}</Text><Text style={styles.hint}>Use this as a conversation starter before the new season.</Text><View style={styles.referenceCard}><Row label="Format" value={`${guidance.format} to ${next.format}`} /><Row label="Pitch" value={`${guidance.pitchRecommended} to ${next.pitchRecommended}`} /><Row label="Goals" value={`${guidance.goalSize} to ${next.goalSize}`} /><Row label="Ball" value={`${guidance.ballSize} to ${next.ballSize}`} /><Row label="Match duration" value={`${guidance.matchDuration} to ${next.matchDuration}`} /></View><View style={styles.noteCard}><Text style={styles.noteTitle}>Rules change</Text><Text style={styles.cardText}>{next.rules.find((rule) => rule.label === "Offside")?.detail ?? "Check the next season's competition handbook for rule changes."}</Text></View></View>;
}

function PitchDiagram({ guidance }: { guidance: AgeGroupGuidance }) {
  const showsPenaltyArea = guidance.format === "9v9" || guidance.format === "11v11";
  return <View accessibilityLabel="Pitch diagram" style={styles.diagramWrap}><Text style={styles.diagramMeasureTop}>{guidance.pitchLength}m</Text><View style={styles.pitchDiagram}><View style={styles.halfwayLine} /><View style={styles.centreCircle} /><View style={[styles.penaltyArea, styles.leftArea, !showsPenaltyArea && styles.goalArea]} /><View style={[styles.penaltyArea, styles.rightArea, !showsPenaltyArea && styles.goalArea]} /><View style={[styles.goal, styles.leftGoal]} /><View style={[styles.goal, styles.rightGoal]} /><Text style={styles.goalAreaLabel}>{guidance.goalArea}</Text></View><Text style={styles.diagramMeasureSide}>{guidance.pitchWidth}m</Text><Text style={styles.diagramCaption}>Diagram is indicative. Markings vary by format and competition.</Text></View>;
}

function FormationDiagram({ formation }: { formation: Formation }) {
  return <View accessibilityLabel={`${formation.name} formation diagram`} style={styles.formationDiagram}>{formation.dots.map((dot, index) => <View key={`${dot.x}-${dot.y}`} style={[styles.formationDot, { left: `${dot.x}%`, top: `${dot.y}%` }]}><Text style={styles.dotText}>{index + 1}</Text></View>)}</View>;
}

function Metric({ label, value }: { label: string; value: string }) { return <View style={styles.metric}><Text style={styles.metricLabel}>{label}</Text><Text style={styles.metricValue}>{value}</Text></View>; }
function Row({ label, value }: { label: string; value: string }) { return <View style={styles.row}><Text style={styles.rowLabel}>{label}</Text><Text style={styles.rowValue}>{value}</Text></View>; }
function Bullet({ text }: { text: string }) { return <View style={styles.bullet}><View style={styles.bulletDot} /><Text style={styles.bulletText}>{text}</Text></View>; }

const styles = StyleSheet.create({
  ageButton: { alignItems: "center", backgroundColor: "#f8f5ed", borderColor: "#d7cfbf", borderRadius: 14, borderWidth: 1, justifyContent: "center", minWidth: 50, paddingHorizontal: 12, paddingVertical: 11 }, ageButtonActive: { backgroundColor: "#1c3825", borderColor: "#1c3825" }, ageButtonLabel: { color: "#465345", fontSize: 14, fontWeight: "800" }, ageButtonLabelActive: { color: "#dce8b1" }, agePicker: { gap: 8, paddingRight: 20 }, bullet: { flexDirection: "row", gap: 9 }, bulletDot: { backgroundColor: "#e58b49", borderRadius: 4, height: 8, marginTop: 6, width: 8 }, bulletText: { color: "#29362c", flex: 1, fontSize: 14, lineHeight: 20 }, cardLabel: { color: "#5f6d59", fontSize: 12, fontWeight: "800", letterSpacing: 0.5, textTransform: "uppercase" }, cardText: { color: "#4f5d50", fontSize: 14, lineHeight: 20 }, centreCircle: { borderColor: "#e5ebc7", borderRadius: 32, borderWidth: 2, height: 64, left: "50%", marginLeft: -32, marginTop: -32, position: "absolute", top: "50%", width: 64 }, checkBox: { borderColor: "#55705a", borderRadius: 4, borderWidth: 2, height: 17, marginTop: 1, width: 17 }, checkRow: { flexDirection: "row", gap: 11 }, checkText: { color: "#29362c", flex: 1, fontSize: 14, lineHeight: 20 }, checklist: { backgroundColor: "#f8f5ed", borderColor: "#ded7c8", borderRadius: 12, borderWidth: 1, gap: 13, padding: 16 }, container: { gap: 18 }, diagramCaption: { color: "#687464", fontSize: 11, marginTop: 8, textAlign: "center" }, diagramMeasureSide: { color: "#36523c", fontSize: 12, fontWeight: "800", position: "absolute", right: -4, top: "50%", transform: [{ rotate: "90deg" }] }, diagramMeasureTop: { color: "#36523c", fontSize: 12, fontWeight: "800", textAlign: "center" }, diagramWrap: { paddingHorizontal: 12, paddingTop: 4 }, dotText: { color: "#19382a", fontSize: 11, fontWeight: "800" }, formationCard: { backgroundColor: "#f8f5ed", borderColor: "#ded7c8", borderRadius: 12, borderWidth: 1, gap: 10, padding: 16 }, formationDiagram: { backgroundColor: "#487a50", borderColor: "#e5ebc7", borderRadius: 8, borderWidth: 2, height: 130, overflow: "hidden", position: "relative" }, formationDot: { alignItems: "center", backgroundColor: "#f4f0e5", borderColor: "#19382a", borderRadius: 14, borderWidth: 2, height: 28, justifyContent: "center", marginLeft: -14, marginTop: -14, position: "absolute", width: 28 }, formationName: { color: "#1a2a1e", fontFamily: "Avenir Next Condensed", fontSize: 26, fontWeight: "800" }, goal: { backgroundColor: "#e5ebc7", height: "20%", position: "absolute", top: "40%", width: 8 }, goalArea: { height: "36%", top: "32%", width: "11%" }, goalAreaLabel: { color: "#e5ebc7", fontSize: 10, fontWeight: "800", left: "50%", marginLeft: -62, position: "absolute", textAlign: "center", top: 8, width: 124 }, halfwayLine: { backgroundColor: "#e5ebc7", height: "100%", left: "50%", position: "absolute", width: 2 }, hint: { color: "#626d60", fontSize: 14, lineHeight: 20 }, introCard: { backgroundColor: "#19382a", borderRadius: 14, gap: 5, padding: 20 }, introText: { color: "#dce4d5", fontSize: 14, lineHeight: 20, marginTop: 4, maxWidth: 300 }, introTitle: { color: "#ffffff", fontFamily: "Avenir Next Condensed", fontSize: 34, fontWeight: "800", letterSpacing: -0.8 }, leftArea: { borderLeftWidth: 0, left: 0 }, leftGoal: { borderLeftWidth: 0, left: -8 }, metric: { backgroundColor: "#e5ebc7", borderRadius: 10, flexGrow: 1, gap: 3, minWidth: "44%", padding: 14 }, metricLabel: { color: "#5a6856", fontSize: 11, fontWeight: "700" }, metricValue: { color: "#18321f", fontSize: 16, fontWeight: "800" }, noteCard: { backgroundColor: "#e5e1d6", borderRadius: 12, gap: 6, padding: 16 }, noteTitle: { color: "#1a2a1e", fontSize: 16, fontWeight: "800" }, penaltyArea: { borderColor: "#e5ebc7", borderWidth: 2, height: "58%", position: "absolute", top: "21%", width: "18%" }, pitchDiagram: { backgroundColor: "#487a50", borderColor: "#e5ebc7", borderRadius: 4, borderWidth: 2, height: 190, overflow: "hidden", position: "relative" }, pitchSize: { color: "#1a2a1e", fontFamily: "Avenir Next Condensed", fontSize: 33, fontWeight: "800", letterSpacing: -0.8 }, referenceCard: { backgroundColor: "#f8f5ed", borderColor: "#ded7c8", borderRadius: 12, borderWidth: 1, gap: 12, padding: 16 }, rightArea: { borderRightWidth: 0, right: 0 }, rightGoal: { borderRightWidth: 0, right: -8 }, row: { borderTopColor: "#ded7c8", borderTopWidth: StyleSheet.hairlineWidth, flexDirection: "row", gap: 12, justifyContent: "space-between", paddingTop: 10 }, rowLabel: { color: "#697166", fontSize: 13 }, rowValue: { color: "#1a2a1e", flex: 1, fontSize: 13, fontWeight: "800", textAlign: "right" }, ruleCard: { backgroundColor: "#f8f5ed", borderColor: "#ded7c8", borderRadius: 12, borderWidth: 1, gap: 5, padding: 16 }, ruleLabel: { color: "#19382a", fontSize: 15, fontWeight: "800" }, ruleList: { gap: 9 }, ruleText: { color: "#4f5d50", fontSize: 14, lineHeight: 20 }, section: { gap: 11 }, sectionButton: { backgroundColor: "#e5e1d6", borderRadius: 10, paddingHorizontal: 11, paddingVertical: 10 }, sectionButtonActive: { backgroundColor: "#19382a" }, sectionButtonText: { color: "#465345", fontSize: 12, fontWeight: "800" }, sectionButtonTextActive: { color: "#f4f0e5" }, sectionNav: { flexDirection: "row", flexWrap: "wrap", gap: 7 }, sectionTitle: { color: "#1a2a1e", fontFamily: "Avenir Next Condensed", fontSize: 27, fontWeight: "800", letterSpacing: -0.3 }, summaryGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 }, version: { color: "#dce8b1", fontSize: 11, fontWeight: "800", marginTop: 6 }
});
