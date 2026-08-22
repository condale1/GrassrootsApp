import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

import { MatchdayDraft } from "../types";

const storageKey = "grassroots-coach-tools-matchday-board";
const initialDraft: MatchdayDraft = {
  opponent: "",
  matchDate: "",
  venue: "",
  kickoff: "",
  focus: "",
  checks: [
    { id: "goals", label: "Goals and pitch set-up", done: false },
    { id: "kit", label: "Balls, bibs and pump", done: false },
    { id: "first-aid", label: "First-aid kit", done: false },
    { id: "respect", label: "Respect reminder for parents", done: false },
    { id: "rotation", label: "Rotation plan ready", done: false }
  ]
};

function isMatchdayDraft(value: unknown): value is MatchdayDraft {
  if (!value || typeof value !== "object") return false;
  const draft = value as MatchdayDraft;
  return typeof draft.opponent === "string" && typeof draft.venue === "string" && typeof draft.kickoff === "string" && typeof draft.focus === "string" && Array.isArray(draft.checks);
}

export function useMatchdayBoard() {
  const [draft, setDraft] = useState<MatchdayDraft>(initialDraft);
  const [hasLoadedMatchday, setHasLoadedMatchday] = useState(false);

  useEffect(() => {
    async function loadBoard() {
      try {
        const saved = await AsyncStorage.getItem(storageKey);
        if (!saved) return;
        const parsed: unknown = JSON.parse(saved);
        if (isMatchdayDraft(parsed)) setDraft({ ...parsed, matchDate: typeof (parsed as Partial<MatchdayDraft>).matchDate === "string" ? parsed.matchDate : "" });
      } catch {
        // Keep the ready-to-use board when storage is unavailable.
      } finally {
        setHasLoadedMatchday(true);
      }
    }

    void loadBoard();
  }, []);

  useEffect(() => {
    if (hasLoadedMatchday) void AsyncStorage.setItem(storageKey, JSON.stringify(draft));
  }, [draft, hasLoadedMatchday]);

  return { draft, hasLoadedMatchday, setDraft };
}
