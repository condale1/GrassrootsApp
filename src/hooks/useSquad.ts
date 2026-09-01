import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

import { Player } from "../types";

const SQUAD_STORAGE_KEY = "grassroots-coach-tools-squad";

function isStoredPlayer(value: unknown): value is Player {
  if (!value || typeof value !== "object") return false;

  const player = value as Player;
  return (
    typeof player.id === "string" &&
    typeof player.name === "string" &&
    typeof player.available === "boolean" &&
    (player.position === undefined || typeof player.position === "string")
  );
}

type StoredSquad = { hasCompletedSetup: boolean; players: Player[]; teamName: string };

function isStoredSquad(value: unknown): value is StoredSquad {
  if (!value || typeof value !== "object") return false;

  const squad = value as StoredSquad;
  return (
    typeof squad.teamName === "string" &&
    typeof squad.hasCompletedSetup === "boolean" &&
    Array.isArray(squad.players) &&
    squad.players.every(isStoredPlayer)
  );
}

export function useSquad() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [teamName, setTeamName] = useState("");
  const [hasCompletedSetup, setHasCompletedSetup] = useState(false);
  const [hasLoadedSquad, setHasLoadedSquad] = useState(false);

  useEffect(() => {
    async function loadSquad() {
      try {
        const storedSquad = await AsyncStorage.getItem(SQUAD_STORAGE_KEY);
        if (!storedSquad) return;

        const parsedSquad: unknown = JSON.parse(storedSquad);
        if (isStoredSquad(parsedSquad)) {
          setPlayers(parsedSquad.players);
          setTeamName(parsedSquad.teamName);
          setHasCompletedSetup(parsedSquad.hasCompletedSetup);
        } else if (Array.isArray(parsedSquad) && parsedSquad.every(isStoredPlayer)) {
          // Existing installs used an array-only format, so keep their squad usable.
          setPlayers(parsedSquad);
          setHasCompletedSetup(true);
        }
      } catch {
        // Retain the default squad if device storage cannot be read.
      } finally {
        setHasLoadedSquad(true);
      }
    }

    void loadSquad();
  }, []);

  useEffect(() => {
    if (hasLoadedSquad) {
      const squad: StoredSquad = { hasCompletedSetup, players, teamName };
      void AsyncStorage.setItem(SQUAD_STORAGE_KEY, JSON.stringify(squad));
    }
  }, [hasCompletedSetup, hasLoadedSquad, players, teamName]);

  return {
    hasCompletedSetup,
    hasLoadedSquad,
    players,
    setHasCompletedSetup,
    setPlayers,
    setTeamName,
    teamName,
  };
}
