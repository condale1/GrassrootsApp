import { useState } from "react";
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";

import { TabBar } from "./src/components/TabBar";
import { useAgeGroup } from "./src/hooks/useAgeGroup";
import { useSquad } from "./src/hooks/useSquad";
import { CoachToolboxScreen } from "./src/screens/CoachToolboxScreen";
import { GameTimeCalculatorScreen } from "./src/screens/GameTimeCalculatorScreen";
import { SquadScreen } from "./src/screens/SquadScreen";
import { AppTab } from "./src/types";

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>("gameTime");
  const ageGroup = useAgeGroup();
  const squad = useSquad();
  const copy = activeTab === "gameTime"
    ? { title: "Game Time", subtitle: "Build a simple, fair rotation plan before kick-off." }
    : activeTab === "squad"
      ? { title: "Squad", subtitle: "Keep your players and match-day availability in one place." }
      : { title: "Coach Toolbox", subtitle: "Age-group rules, pitch dimensions, and match set-up at a glance." };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.shell}>
        <View style={styles.backgroundOrbTop} />
        <View style={styles.backgroundOrbBottom} />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.eyebrow}>Coach tools</Text>
            <Text style={styles.title}>{copy.title}</Text>
            <Text style={styles.subtitle}>{copy.subtitle}</Text>
          </View>
          {activeTab === "gameTime" ? <GameTimeCalculatorScreen players={squad.players} /> : null}
          {activeTab === "squad" ? <SquadScreen {...squad} /> : null}
          {activeTab === "toolbox" ? <CoachToolboxScreen {...ageGroup} /> : null}
        </ScrollView>
        <TabBar activeTab={activeTab} onChange={setActiveTab} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#efe9de"
  },
  shell: {
    flex: 1,
    backgroundColor: "#efe9de"
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 104,
    gap: 18
  },
  header: {
    gap: 8
  },
  eyebrow: {
    color: "#5d7758",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2.2,
    textTransform: "uppercase"
  },
  title: {
    color: "#14281d",
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: -1.2
  },
  subtitle: {
    color: "#425044",
    fontSize: 16,
    lineHeight: 22,
    maxWidth: 320
  },
  backgroundOrbTop: {
    position: "absolute",
    top: -80,
    right: -20,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#d6e58f",
    opacity: 0.22
  },
  backgroundOrbBottom: {
    position: "absolute",
    bottom: 90,
    left: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#f28f3b",
    opacity: 0.13
  }
});
