import { ReactNode, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type MatchdaySection = "board" | "gameTime" | "timer";
type Props = {
  board: ReactNode;
  gameTime: ReactNode;
  onSectionChange: () => void;
  timer: ReactNode;
};

const sections: { id: MatchdaySection; label: string }[] = [
  { id: "board", label: "Match board" },
  { id: "gameTime", label: "Game time" },
  { id: "timer", label: "Timer" },
];

export function MatchdayHubScreen({
  board,
  gameTime,
  onSectionChange,
  timer,
}: Props) {
  const [section, setSection] = useState<MatchdaySection>("board");
  const selectSection = (nextSection: MatchdaySection) => {
    setSection(nextSection);
    onSectionChange();
  };

  return (
    <View style={styles.container}>
      <View style={styles.switcher}>
        {sections.map((item) => (
          <Pressable
            accessibilityLabel={`Open ${item.label}`}
            key={item.id}
            onPress={() => selectSection(item.id)}
            style={[
              styles.switchButton,
              section === item.id && styles.switchButtonActive,
            ]}
          >
            <Text
              style={[
                styles.switchText,
                section === item.id && styles.switchTextActive,
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>
      {section === "board" ? board : null}
      {section === "gameTime" ? gameTime : null}
      {section === "timer" ? timer : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 18 },
  switchButton: {
    alignItems: "center",
    borderBottomColor: "transparent",
    borderBottomWidth: 3,
    flex: 1,
    paddingBottom: 9,
    paddingTop: 3,
  },
  switchButtonActive: { borderBottomColor: "#f06a2f" },
  switcher: {
    borderBottomColor: "#d9d1c1",
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: 3,
  },
  switchText: { color: "#687365", fontSize: 12, fontWeight: "800" },
  switchTextActive: { color: "#173a2a" },
});
