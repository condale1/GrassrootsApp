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
    ? { title: "Game Time" }
    : activeScreen === "squad"
      ? { title: "Squad" }
      : activeScreen === "sessions" ? { title: "Sessions" } : { title: "Coach Toolbox" };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.shell}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.keyboardArea}>
          <ScrollView automaticallyAdjustKeyboardInsets contentContainerStyle={styles.content} keyboardDismissMode="interactive" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <View style={styles.titleRow}><Text style={styles.title}>{copy.title}</Text><Pressable accessibilityLabel="Open menu" onPress={() => setMenuOpen(true)} style={styles.menuButton}><View style={styles.menuLine} /><View style={styles.menuLine} /><View style={styles.menuLine} /></Pressable></View>
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
    backgroundColor: "#f3f0e8"
  },
  shell: {
    flex: 1,
    backgroundColor: "#f3f0e8"
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 24,
    gap: 18
  },
  keyboardArea: { flex: 1 },
  header: { paddingBottom: 2 },
  menuButton: { alignItems: "center", backgroundColor: "#19382a", borderRadius: 12, gap: 4, height: 42, justifyContent: "center", width: 42 },
  menuLine: { backgroundColor: "#f4f0e5", borderRadius: 2, height: 2, width: 17 },
  title: {
    color: "#14281d",
    fontFamily: "Avenir Next Condensed",
    fontSize: 38,
    fontWeight: "800",
    letterSpacing: -1.4
  },
  titleRow: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" }
});
