import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";

import { MenuDrawer } from "./src/components/MenuDrawer";
import { TabBar } from "./src/components/TabBar";
import { useAgeGroup } from "./src/hooks/useAgeGroup";
import { useSessionBuilder } from "./src/hooks/useSessionBuilder";
import { useSquad } from "./src/hooks/useSquad";
import { CoachToolboxScreen } from "./src/screens/CoachToolboxScreen";
import { GameTimeCalculatorScreen } from "./src/screens/GameTimeCalculatorScreen";
import { SessionBuilderScreen } from "./src/screens/SessionBuilderScreen";
import { SquadScreen } from "./src/screens/SquadScreen";
import { AppTab } from "./src/types";

export default function App() {
  const [activeScreen, setActiveScreen] = useState<AppTab | "squad">("gameTime");
  const [menuOpen, setMenuOpen] = useState(false);
  const ageGroup = useAgeGroup();
  const sessionBuilder = useSessionBuilder();
  const squad = useSquad();
  const copy = activeScreen === "gameTime"
    ? { title: "Game Time", subtitle: "Build a simple, fair rotation plan before kick-off." }
    : activeScreen === "squad"
      ? { title: "Squad", subtitle: "Keep your players and match-day availability in one place." }
      : activeScreen === "sessions" ? { title: "Sessions", subtitle: "Create a lively training plan, one block at a time." } : { title: "Coach Toolbox", subtitle: "Age-group rules, pitch dimensions, and match set-up at a glance." };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.shell}>
        <View style={styles.backgroundOrbTop} />
        <View style={styles.backgroundOrbBottom} />
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.keyboardArea}>
          <ScrollView automaticallyAdjustKeyboardInsets contentContainerStyle={styles.content} keyboardDismissMode="interactive" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <Text style={styles.eyebrow}>Coach tools</Text>
              <View style={styles.titleRow}><Text style={styles.title}>{copy.title}</Text><Pressable accessibilityLabel="Open menu" onPress={() => setMenuOpen(true)} style={styles.menuButton}><View style={styles.menuLine} /><View style={styles.menuLine} /><View style={styles.menuLine} /></Pressable></View>
              <Text style={styles.subtitle}>{copy.subtitle}</Text>
            </View>
            {activeScreen === "gameTime" ? <GameTimeCalculatorScreen players={squad.players} /> : null}
            {activeScreen === "squad" ? <SquadScreen {...squad} /> : null}
            {activeScreen === "sessions" ? <SessionBuilderScreen ageGroup={ageGroup.ageGroup} {...sessionBuilder} /> : null}
            {activeScreen === "toolbox" ? <CoachToolboxScreen {...ageGroup} /> : null}
          </ScrollView>
          <TabBar activeTab={activeScreen === "squad" ? "gameTime" : activeScreen} onChange={setActiveScreen} />
        </KeyboardAvoidingView>
        <MenuDrawer onClose={() => setMenuOpen(false)} onOpenSquad={() => { setActiveScreen("squad"); setMenuOpen(false); }} visible={menuOpen} />
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
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 24,
    gap: 18
  },
  keyboardArea: { flex: 1 },
  header: {
    gap: 8
  },
  menuButton: { alignItems: "center", backgroundColor: "#dce8b1", borderRadius: 16, gap: 4, height: 40, justifyContent: "center", width: 40 },
  menuLine: { backgroundColor: "#18321f", borderRadius: 2, height: 2, width: 17 },
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
  titleRow: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
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
