import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppTab } from "../types";

const tabs: { id: AppTab; label: string }[] = [
  { id: "gameTime", label: "Game Time" },
  { id: "matchday", label: "Matchday" },
  { id: "sessions", label: "Sessions" },
  { id: "toolbox", label: "Toolbox" }
];

type TabBarProps = { activeTab: AppTab; onChange: (tab: AppTab) => void };

export function TabBar({ activeTab, onChange }: TabBarProps) {
  return (
    <View style={styles.wrap}>
      {tabs.map((tab) => {
        const active = tab.id === activeTab;
        return (
          <Pressable key={tab.id} onPress={() => onChange(tab.id)} style={[styles.tab, active ? styles.tabActive : null]}>
            <Text style={[styles.label, active ? styles.labelActive : null]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { color: "#d7dfd2", fontSize: 11, fontWeight: "800", letterSpacing: 0.1 },
  labelActive: { color: "#152118" },
  tab: { alignItems: "center", borderRadius: 10, flex: 1, justifyContent: "center", paddingVertical: 13 },
  tabActive: { backgroundColor: "#d6e58f" },
  wrap: { backgroundColor: "#19382a", borderRadius: 14, flexDirection: "row", gap: 4, marginBottom: 12, marginHorizontal: 16, padding: 5 }
});
