import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppTab } from "../types";

const tabs: { id: AppTab; label: string }[] = [
  { id: "gameTime", label: "Game Time" },
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
  label: { color: "#d7dfd2", fontSize: 13, fontWeight: "800" },
  labelActive: { color: "#152118" },
  tab: { alignItems: "center", borderRadius: 18, flex: 1, justifyContent: "center", paddingVertical: 12 },
  tabActive: { backgroundColor: "#d6e58f" },
  wrap: { backgroundColor: "#14281d", borderRadius: 24, bottom: 18, flexDirection: "row", gap: 8, left: 16, padding: 8, position: "absolute", right: 16 }
});
