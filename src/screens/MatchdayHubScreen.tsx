import { ReactNode, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type MatchdaySection = "board" | "gameTime" | "timer";
type Props = { board: ReactNode; gameTime: ReactNode; onSectionChange: () => void; timer: ReactNode };

const sections: { id: MatchdaySection; label: string }[] = [
  { id: "board", label: "Match board" },
  { id: "gameTime", label: "Game time" },
  { id: "timer", label: "Timer" }
];

export function MatchdayHubScreen({ board, gameTime, onSectionChange, timer }: Props) {
  const [section, setSection] = useState<MatchdaySection>("board");
  const selectSection = (nextSection: MatchdaySection) => {
    setSection(nextSection);
    onSectionChange();
  };

  return <View style={styles.container}>
    <View style={styles.intro}><Text style={styles.title}>Everything ready for matchday.</Text><Text style={styles.copy}>Plan the board, manage fair game time, then run the clock from one place.</Text></View>
    <View style={styles.switcher}>{sections.map((item) => <Pressable accessibilityLabel={`Open ${item.label}`} key={item.id} onPress={() => selectSection(item.id)} style={[styles.switchButton, section === item.id && styles.switchButtonActive]}><Text style={[styles.switchText, section === item.id && styles.switchTextActive]}>{item.label}</Text></Pressable>)}</View>
    {section === "board" ? board : null}
    {section === "gameTime" ? gameTime : null}
    {section === "timer" ? timer : null}
  </View>;
}

const styles = StyleSheet.create({
  container: { gap: 16 },
  copy: { color: "#dce4d5", fontSize: 14, lineHeight: 20 },
  intro: { backgroundColor: "#19382a", borderRadius: 14, gap: 5, padding: 18 },
  switchButton: { alignItems: "center", borderRadius: 10, flex: 1, paddingVertical: 11 },
  switchButtonActive: { backgroundColor: "#dce8b1" },
  switcher: { backgroundColor: "#e5e1d6", borderRadius: 12, flexDirection: "row", gap: 3, padding: 4 },
  switchText: { color: "#5a6557", fontSize: 12, fontWeight: "800" },
  switchTextActive: { color: "#19382a" },
  title: { color: "#ffffff", fontFamily: "Avenir Next Condensed", fontSize: 28, fontWeight: "800", letterSpacing: -0.5 }
});
