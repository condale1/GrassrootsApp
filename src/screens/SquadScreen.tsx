import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { Player } from "../types";

type SquadScreenProps = {
  hasLoadedSquad: boolean;
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
};

export function SquadScreen({ hasLoadedSquad, players, setPlayers }: SquadScreenProps) {
  const availableCount = players.filter((player) => player.available).length;

  const updatePlayer = (id: string, updates: Partial<Pick<Player, "available" | "name">>) => {
    setPlayers((currentPlayers) => currentPlayers.map((player) => (player.id === id ? { ...player, ...updates } : player)));
  };

  return (
    <View style={styles.container}>
      <View style={styles.summary}>
        <Text style={styles.summaryValue}>{availableCount}</Text>
        <View>
          <Text style={styles.summaryLabel}>available today</Text>
          <Text style={styles.summaryCaption}>{hasLoadedSquad ? "Squad saved on this device" : "Loading saved squad..."}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Players</Text>
        <Text style={styles.sectionHint}>Update names once, then set availability before every match.</Text>
        <View style={styles.playerList}>
          {players.map((player) => (
            <View key={player.id} style={[styles.playerRow, !player.available ? styles.playerRowUnavailable : null]}>
              <Pressable
                accessibilityLabel={`Mark ${player.name || "player"} as ${player.available ? "unavailable" : "available"}`}
                onPress={() => updatePlayer(player.id, { available: !player.available })}
                style={[styles.availabilityButton, player.available ? styles.availabilityButtonAvailable : styles.availabilityButtonUnavailable]}
              >
                <Text style={[styles.availabilityText, player.available ? styles.availabilityTextAvailable : styles.availabilityTextUnavailable]}>{player.available ? "Available" : "Out"}</Text>
              </Pressable>
              <TextInput accessibilityLabel="Player name" onChangeText={(name) => updatePlayer(player.id, { name })} placeholder="Player name" placeholderTextColor="#8a9187" style={[styles.nameInput, !player.available ? styles.nameInputUnavailable : null]} value={player.name} />
              <Pressable accessibilityLabel={`Remove ${player.name || "player"}`} onPress={() => setPlayers((currentPlayers) => currentPlayers.filter((currentPlayer) => currentPlayer.id !== player.id))} style={styles.removeButton}>
                <Text style={styles.removeButtonText}>x</Text>
              </Pressable>
            </View>
          ))}
        </View>
        <Pressable onPress={() => setPlayers((currentPlayers) => [...currentPlayers, { id: `player-${Date.now()}`, name: `Player ${currentPlayers.length + 1}`, available: true }])} style={styles.addPlayerButton}>
          <Text style={styles.addPlayerButtonText}>+ Add player</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  addPlayerButton: { alignItems: "center", borderColor: "#78925d", borderRadius: 10, borderStyle: "dashed", borderWidth: 1, paddingVertical: 12 },
  addPlayerButtonText: { color: "#315129", fontSize: 14, fontWeight: "800" },
  availabilityButton: { alignItems: "center", borderRadius: 10, justifyContent: "center", minWidth: 68, paddingHorizontal: 8, paddingVertical: 9 },
  availabilityButtonAvailable: { backgroundColor: "#dcebc1" },
  availabilityButtonUnavailable: { backgroundColor: "#eee8dc" },
  availabilityText: { fontSize: 11, fontWeight: "800" },
  availabilityTextAvailable: { color: "#285023" },
  availabilityTextUnavailable: { color: "#776f63" },
  container: { gap: 22 },
  nameInput: { color: "#1a2a1e", flex: 1, fontSize: 15, fontWeight: "700", minWidth: 70, paddingHorizontal: 6, paddingVertical: 0 },
  nameInputUnavailable: { color: "#77776f", textDecorationLine: "line-through" },
  playerList: { gap: 7 },
  playerRow: { alignItems: "center", backgroundColor: "#f8f5ed", borderColor: "#ded7c8", borderRadius: 10, borderWidth: 1, flexDirection: "row", gap: 5, padding: 6 },
  playerRowUnavailable: { backgroundColor: "#f1eee6", borderColor: "#e1dbcf" },
  removeButton: { alignItems: "center", height: 32, justifyContent: "center", width: 28 },
  removeButtonText: { color: "#8b6150", fontSize: 18, fontWeight: "600" },
  section: { gap: 10 },
  sectionHint: { color: "#626d60", fontSize: 14, lineHeight: 20 },
  sectionTitle: { color: "#1a2a1e", fontFamily: "Avenir Next Condensed", fontSize: 23, fontWeight: "800", letterSpacing: -0.3 },
  summary: { alignItems: "center", backgroundColor: "#19382a", borderRadius: 14, flexDirection: "row", gap: 14, padding: 20 },
  summaryCaption: { color: "#d0d9c3", fontSize: 12, marginTop: 2 },
  summaryLabel: { color: "#ffffff", fontSize: 17, fontWeight: "800" },
  summaryValue: { color: "#dce8b1", fontFamily: "Avenir Next Condensed", fontSize: 46, fontWeight: "800", letterSpacing: -1 }
});
