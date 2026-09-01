import { Linking, Pressable, StyleSheet, Text, View } from "react-native";

const privacyEmail = "condale1@googlemail.com";

export function PrivacyPolicyScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Your data stays with you.</Text>
        <Text style={styles.heroCopy}>
          Benchside is designed to work without an account, a backend service or
          analytics.
        </Text>
      </View>

      <Section title="What Benchside stores">
        <Text style={styles.copy}>
          Benchside saves the squad names and availability, matchday plans,
          training sessions, custom drills and selected age group that you
          enter. This information is stored locally on your device so the app
          works offline.
        </Text>
      </Section>

      <Section title="What we do not collect">
        <Text style={styles.copy}>
          We do not collect, receive, sell or share your data. Benchside does
          not use accounts, analytics, advertising, location tracking or a
          remote database.
        </Text>
      </Section>

      <Section title="Sharing plans">
        <Text style={styles.copy}>
          When you choose to share a matchday or game-time graphic, Benchside
          creates the graphic on your device and opens the system share sheet.
          You decide whether to send it and which app or person receives it.
        </Text>
      </Section>

      <Section title="Keeping or removing data">
        <Text style={styles.copy}>
          Your data remains on your device until you change or remove it in the
          app. Deleting Benchside removes its locally stored app data from that
          device.
        </Text>
      </Section>

      <View style={styles.contactCard}>
        <Text style={styles.contactTitle}>Questions about privacy?</Text>
        <Pressable
          accessibilityLabel="Email Benchside privacy support"
          onPress={() => void Linking.openURL(`mailto:${privacyEmail}`)}
        >
          <Text style={styles.email}>{privacyEmail}</Text>
        </Pressable>
      </View>

      <Text style={styles.updated}>Last updated: September 2026</Text>
    </View>
  );
}

function Section({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 20 },
  contactCard: {
    backgroundColor: "#f4d9b7",
    borderLeftColor: "#f06a2f",
    borderLeftWidth: 4,
    borderRadius: 3,
    gap: 5,
    padding: 17,
  },
  contactTitle: { color: "#7b3519", fontSize: 15, fontWeight: "800" },
  copy: { color: "#48554a", fontSize: 15, lineHeight: 22 },
  email: { color: "#173a2a", fontSize: 16, fontWeight: "800" },
  hero: { backgroundColor: "#173a2a", borderRadius: 5, gap: 7, padding: 20 },
  heroCopy: { color: "#dce4d5", fontSize: 15, lineHeight: 22 },
  heroTitle: {
    color: "#ffffff",
    fontFamily: "Avenir Next Condensed",
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: -0.7,
  },
  section: {
    backgroundColor: "#fbf8f1",
    borderColor: "#d9d1c1",
    borderRadius: 5,
    borderWidth: 1,
    gap: 7,
    padding: 16,
  },
  sectionTitle: {
    color: "#173a2a",
    fontFamily: "Avenir Next Condensed",
    fontSize: 23,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  updated: { color: "#687365", fontSize: 12, textAlign: "center" },
});
