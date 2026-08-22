import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { SessionDraft } from "../types";

const key = "grassroots-coach-tools-session-draft";
const initialDraft: SessionDraft = { title: "Saturday training", blocks: [{ id: "1", drillId: "traffic-lights", minutes: 10 }, { id: "2", drillId: "pirate-treasure", minutes: 12 }, { id: "3", drillId: "numbers-game", minutes: 15 }, { id: "4", drillId: "mini-match", minutes: 15 }], customDrills: [] };

function isSessionDraft(value: unknown): value is Omit<SessionDraft, "customDrills"> & Partial<Pick<SessionDraft, "customDrills">> {
  if (!value || typeof value !== "object") return false;
  const draft = value as SessionDraft;
  return typeof draft.title === "string" && Array.isArray(draft.blocks) && (!draft.customDrills || Array.isArray(draft.customDrills));
}

export function useSessionBuilder() {
  const [draft, setDraft] = useState<SessionDraft>(initialDraft);
  const [hasLoadedDraft, setHasLoadedDraft] = useState(false);
  useEffect(() => { void AsyncStorage.getItem(key).then((value) => { if (!value) return; const parsed: unknown = JSON.parse(value); if (isSessionDraft(parsed)) setDraft({ ...parsed, customDrills: parsed.customDrills ?? [] }); }).catch(() => undefined).finally(() => setHasLoadedDraft(true)); }, []);
  useEffect(() => { if (hasLoadedDraft) void AsyncStorage.setItem(key, JSON.stringify(draft)); }, [draft, hasLoadedDraft]);
  return { draft, hasLoadedDraft, setDraft };
}
