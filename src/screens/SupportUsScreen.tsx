import { StyleSheet, Text, View } from "react-native";

export function SupportUsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Built for the touchline.</Text>
        <Text style={styles.heroCopy}>
          Benchside is made to give grassroots coaches practical tools when
          they need them most.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Keep Benchside going</Text>
        <Text style={styles.copy}>
          We will never charge for the use of Benchside. If you wish to support
          us, you will be able to buy us a coffee here.
        </Text>
      </View>

      <View style={styles.comingSoon}>
        <Text style={styles.comingSoonTitle}>Ko-fi link coming soon</Text>
        <Text style={styles.comingSoonCopy}>
          Thank you for helping us keep this useful for volunteer coaches.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fbf8f1",
    borderColor: "#d9d1c1",
    borderRadius: 5,
    borderWidth: 1,
    gap: 8,
    padding: 18,
  },
  comingSoon: {
    backgroundColor: "#f4d9b7",
    borderLeftColor: "#f06a2f",
    borderLeftWidth: 4,
    borderRadius: 3,
    gap: 5,
    padding: 17,
  },
  comingSoonCopy: { color: "#7b3519", fontSize: 14, lineHeight: 21 },
  comingSoonTitle: { color: "#7b3519", fontSize: 16, fontWeight: "800" },
  container: { gap: 20 },
  copy: { color: "#48554a", fontSize: 16, lineHeight: 24 },
  hero: { backgroundColor: "#173a2a", borderRadius: 5, gap: 7, padding: 20 },
  heroCopy: { color: "#dce4d5", fontSize: 15, lineHeight: 22 },
  heroTitle: {
    color: "#ffffff",
    fontFamily: "Avenir Next Condensed",
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: -0.7,
  },
  title: {
    color: "#173a2a",
    fontFamily: "Avenir Next Condensed",
    fontSize: 25,
    fontWeight: "800",
    letterSpacing: -0.4,
  },
});
