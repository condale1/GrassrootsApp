import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

import { Player } from "../types";

const SQUAD_STORAGE_KEY = "grassroots-coach-tools-squad";
const DEFAULT_PLAYERS: Player[] = Array.from({ length: 8 }, (_, index) => ({
  id: `player-${index + 1}`,
  name: `Player ${index + 1}`,
  available: true
}));

function isStoredPlayer(value: unknown): value is Player {
  if (!value || typeof value !== "object") return false;

  const player = value as Player;
  return typeof player.id === "string" && typeof player.name === "string" && typeof player.available === "boolean";
}

export function useSquad() {
  const [players, setPlayers] = useState<Player[]>(DEFAULT_PLAYERS);
  const [hasLoadedSquad, setHasLoadedSquad] = useState(false);

  useEffect(() => {
    async function loadSquad() {
      try {
        const storedSquad = await AsyncStorage.getItem(SQUAD_STORAGE_KEY);
        if (!storedSquad) return;

        const parsedSquad: unknown = JSON.parse(storedSquad);
        if (Array.isArray(parsedSquad) && parsedSquad.every(isStoredPlayer)) setPlayers(parsedSquad);
      } catch {
        // Retain the default squad if device storage cannot be read.
      } finally {
        setHasLoadedSquad(true);
      }
    }

    void loadSquad();
  }, []);

  useEffect(() => {
    if (hasLoadedSquad) void AsyncStorage.setItem(SQUAD_STORAGE_KEY, JSON.stringify(players));
  }, [hasLoadedSquad, players]);

  return { hasLoadedSquad, players, setPlayers };
}
