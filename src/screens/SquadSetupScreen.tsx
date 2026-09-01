import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { Player } from "../types";

type Props = {
  onComplete: () => void;
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  setTeamName: React.Dispatch<React.SetStateAction<string>>;
  teamName: string;
};

export function SquadSetupScreen({
  onComplete,
  players,
  setPlayers,
  setTeamName,
  teamName,
}: Props) {
  const namedPlayers = players.filter((player) => player.name.trim()).length;
  const canContinue = Boolean(teamName.trim()) && namedPlayers > 0;
  const updatePlayer = (
    id: string,
    updates: Partial<Pick<Player, "name" | "position">>,
  ) => {
    setPlayers((current) =>
      current.map((player) =>
        player.id === id ? { ...player, ...updates } : player,
      ),
    );
  };
  const addPlayer = () =>
    setPlayers((current) => [
      ...current,
      { available: true, id: `player-${Date.now()}`, name: "" },
    ]);

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.kicker}>BENCHSIDE</Text>
        <Text style={styles.title}>Set up your squad.</Text>
        <Text style={styles.heroCopy}>
          Add the team you coach and the players you work with. You can change
          everything later.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Team name</Text>
        <TextInput
          accessibilityLabel="Setup team name"
          autoCapitalize="words"
          onChangeText={setTeamName}
          placeholder="e.g. Oakwood Rangers U10s"
          placeholderTextColor="#8a9187"
          style={styles.teamInput}
          value={teamName}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.label}>Squad</Text>
          <Text style={styles.optional}>Positions are optional</Text>
        </View>
        <Text style={styles.hint}>
          Start with one player. Add the rest now or from the Squad menu later.
        </Text>
        <View style={styles.players}>
          {players.map((player, index) => (
            <View key={player.id} style={styles.playerRow}>
              <Text style={styles.number}>{index + 1}</Text>
              <View style={styles.playerInputs}>
                <TextInput
                  accessibilityLabel={`Setup player ${index + 1} name`}
                  autoCapitalize="words"
                  onChangeText={(name) => updatePlayer(player.id, { name })}
                  placeholder="Player name"
                  placeholderTextColor="#8a9187"
                  style={styles.playerInput}
                  value={player.name}
                />
                <TextInput
                  accessibilityLabel={`Setup player ${index + 1} position`}
                  autoCapitalize="characters"
                  onChangeText={(position) =>
                    updatePlayer(player.id, { position })
                  }
                  placeholder="Position (optional)"
                  placeholderTextColor="#8a9187"
                  style={styles.positionInput}
                  value={player.position ?? ""}
                />
              </View>
            </View>
          ))}
        </View>
        <Pressable onPress={addPlayer} style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add player</Text>
        </Pressable>
      </View>

      <Pressable
        accessibilityState={{ disabled: !canContinue }}
        disabled={!canContinue}
        onPress={onComplete}
        style={[styles.continueButton, !canContinue && styles.continueDisabled]}
      >
        <Text style={styles.continueText}>Start using Benchside</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  addButton: { alignItems: "center", borderColor: "#78925d", borderRadius: 5, borderStyle: "dashed", borderWidth: 1, paddingVertical: 12 },
  addButtonText: { color: "#315129", fontSize: 14, fontWeight: "800" },
  container: { gap: 22 },
  continueButton: { alignItems: "center", backgroundColor: "#f06a2f", borderRadius: 5, paddingVertical: 16 },
  continueDisabled: { backgroundColor: "#d9d1c1" },
  continueText: { color: "#ffffff", fontSize: 16, fontWeight: "800" },
  hero: { backgroundColor: "#173a2a", borderRadius: 5, gap: 7, padding: 22 },
  heroCopy: { color: "#dce4d5", fontSize: 15, lineHeight: 22 },
  hint: { color: "#687365", fontSize: 14, lineHeight: 20 },
  kicker: { color: "#f4b08b", fontSize: 11, fontWeight: "900", letterSpacing: 1.4 },
  label: { color: "#173a2a", fontFamily: "Avenir Next Condensed", fontSize: 24, fontWeight: "800", letterSpacing: -0.3 },
  number: { color: "#f06a2f", fontSize: 15, fontWeight: "900", width: 20 },
  optional: { color: "#687365", fontSize: 12, fontWeight: "700" },
  playerInput: { color: "#173a2a", fontSize: 16, fontWeight: "800", padding: 0 },
  playerInputs: { flex: 1, gap: 4 },
  playerRow: { alignItems: "center", backgroundColor: "#fbf8f1", borderColor: "#d9d1c1", borderRadius: 5, borderWidth: 1, flexDirection: "row", gap: 8, padding: 12 },
  players: { gap: 8 },
  positionInput: { color: "#687365", fontSize: 12, padding: 0 },
  section: { gap: 10 },
  sectionHeader: { alignItems: "baseline", flexDirection: "row", justifyContent: "space-between" },
  teamInput: { backgroundColor: "#fbf8f1", borderBottomColor: "#d9d1c1", borderBottomWidth: 1, color: "#173a2a", fontSize: 18, fontWeight: "800", paddingBottom: 10, paddingHorizontal: 0, paddingTop: 5 },
  title: { color: "#ffffff", fontFamily: "Avenir Next Condensed", fontSize: 38, fontWeight: "800", letterSpacing: -0.9 },
});
