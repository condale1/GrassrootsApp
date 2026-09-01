import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppTab } from "../types";

const tabs: { id: AppTab; label: string }[] = [
  { id: "matchday", label: "Matchday" },
  { id: "sessions", label: "Training" },
  { id: "toolbox", label: "Toolbox" },
];

type TabBarProps = { activeTab: AppTab; onChange: (tab: AppTab) => void };

export function TabBar({ activeTab, onChange }: TabBarProps) {
  return (
    <View style={styles.wrap}>
      {tabs.map((tab) => {
        const active = tab.id === activeTab;
        return (
          <Pressable
            key={tab.id}
            onPress={() => onChange(tab.id)}
            style={[styles.tab, active ? styles.tabActive : null]}
          >
            <Text style={[styles.label, active ? styles.labelActive : null]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: "#dce4d5",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  labelActive: { color: "#1c2a20" },
  tab: {
    alignItems: "center",
    borderRadius: 3,
    flex: 1,
    justifyContent: "center",
    paddingVertical: 13,
  },
  tabActive: { backgroundColor: "#f06a2f" },
  wrap: {
    backgroundColor: "#173a2a",
    borderRadius: 6,
    flexDirection: "row",
    gap: 3,
    marginBottom: 12,
    marginHorizontal: 16,
    padding: 4,
  },
});
