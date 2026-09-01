import { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { MenuDrawer } from "./src/components/MenuDrawer";
import { TabBar } from "./src/components/TabBar";
import { useAgeGroup } from "./src/hooks/useAgeGroup";
import { useMatchdayBoard } from "./src/hooks/useMatchdayBoard";
import { useSessionBuilder } from "./src/hooks/useSessionBuilder";
import { useSquad } from "./src/hooks/useSquad";
import { resetScrollPosition } from "./src/lib/scroll";
import { CoachToolboxScreen } from "./src/screens/CoachToolboxScreen";
import { GameTimeCalculatorScreen } from "./src/screens/GameTimeCalculatorScreen";
import { MatchdayBoardScreen } from "./src/screens/MatchdayBoardScreen";
import { MatchdayHubScreen } from "./src/screens/MatchdayHubScreen";
import { CoachingTimerScreen } from "./src/screens/CoachingTimerScreen";
import { PrivacyPolicyScreen } from "./src/screens/PrivacyPolicyScreen";
import { SessionBuilderScreen } from "./src/screens/SessionBuilderScreen";
import { SquadScreen } from "./src/screens/SquadScreen";
import { SupportUsScreen } from "./src/screens/SupportUsScreen";
import { AppTab } from "./src/types";

export default function App() {
  const [activeScreen, setActiveScreen] = useState<
    AppTab | "privacy" | "squad" | "support"
  >("matchday");
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const ageGroup = useAgeGroup();
  const matchdayBoard = useMatchdayBoard();
  const sessionBuilder = useSessionBuilder();
  const squad = useSquad();
  const copy =
    activeScreen === "matchday"
      ? { title: "Matchday" }
      : activeScreen === "squad"
        ? { title: "Squad" }
        : activeScreen === "privacy"
          ? { title: "Privacy" }
          : activeScreen === "support"
            ? { title: "Support Us" }
          : activeScreen === "sessions"
            ? { title: "Training" }
            : { title: "Coach Toolbox" };
  const navigateTo = (screen: AppTab | "privacy" | "squad" | "support") => {
    resetScrollPosition(scrollViewRef);
    setActiveScreen(screen);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.shell}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.keyboardArea}
        >
          <ScrollView
            automaticallyAdjustKeyboardInsets
            contentContainerStyle={styles.content}
            keyboardDismissMode="interactive"
            keyboardShouldPersistTaps="handled"
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <View style={styles.titleRow}>
                <Text style={styles.title}>{copy.title}</Text>
                <Pressable
                  accessibilityLabel="Open menu"
                  onPress={() => setMenuOpen(true)}
                  style={styles.menuButton}
                >
                  <View style={styles.menuLine} />
                  <View style={styles.menuLine} />
                  <View style={styles.menuLine} />
                </Pressable>
              </View>
            </View>
            {activeScreen === "matchday" ? (
              <MatchdayHubScreen
                gameTime={<GameTimeCalculatorScreen players={squad.players} />}
                board={
                  <MatchdayBoardScreen
                    {...matchdayBoard}
                    players={squad.players}
                  />
                }
                timer={<CoachingTimerScreen />}
                onSectionChange={() => resetScrollPosition(scrollViewRef)}
              />
            ) : null}
            {activeScreen === "squad" ? <SquadScreen {...squad} /> : null}
            {activeScreen === "privacy" ? <PrivacyPolicyScreen /> : null}
            {activeScreen === "support" ? <SupportUsScreen /> : null}
            {activeScreen === "sessions" ? (
              <SessionBuilderScreen
                ageGroup={ageGroup.ageGroup}
                {...sessionBuilder}
              />
            ) : null}
            {activeScreen === "toolbox" ? (
              <CoachToolboxScreen {...ageGroup} />
            ) : null}
          </ScrollView>
          <TabBar
            activeTab={
              activeScreen === "squad" ||
              activeScreen === "privacy" ||
              activeScreen === "support"
                ? "matchday"
                : activeScreen
            }
            onChange={navigateTo}
          />
        </KeyboardAvoidingView>
        <MenuDrawer
          onClose={() => setMenuOpen(false)}
          onOpenSquad={() => {
            navigateTo("squad");
            setMenuOpen(false);
          }}
          onOpenPrivacy={() => {
            navigateTo("privacy");
            setMenuOpen(false);
          }}
          onOpenSupport={() => {
            navigateTo("support");
            setMenuOpen(false);
          }}
          visible={menuOpen}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f4efe3" },
  shell: {
    flex: 1,
    backgroundColor: "#f4efe3",
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 24,
    gap: 18,
  },
  keyboardArea: { flex: 1 },
  header: {
    borderBottomColor: "#d9d1c1",
    borderBottomWidth: 1,
    paddingBottom: 14,
  },
  menuButton: {
    alignItems: "center",
    backgroundColor: "#173a2a",
    borderRadius: 5,
    gap: 4,
    height: 38,
    justifyContent: "center",
    width: 38,
  },
  menuLine: { backgroundColor: "#f4efe3", height: 2, width: 16 },
  title: {
    color: "#173a2a",
    fontFamily: "Avenir Next Condensed",
    fontSize: 40,
    fontWeight: "800",
    letterSpacing: -1.1,
  },
  titleRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
