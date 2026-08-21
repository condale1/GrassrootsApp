import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { SessionDraft } from "../types";

const key = "grassroots-coach-tools-session-draft";
const initialDraft: SessionDraft = { title: "Saturday training", blocks: [{ id: "1", drillId: "traffic-lights", minutes: 10 }, { id: "2", drillId: "pirate-treasure", minutes: 12 }, { id: "3", drillId: "numbers-game", minutes: 15 }, { id: "4", drillId: "mini-match", minutes: 15 }] };

export function useSessionBuilder() {
  const [draft, setDraft] = useState<SessionDraft>(initialDraft);
  const [hasLoadedDraft, setHasLoadedDraft] = useState(false);
  useEffect(() => { void AsyncStorage.getItem(key).then((value) => { if (value) setDraft(JSON.parse(value) as SessionDraft); }).catch(() => undefined).finally(() => setHasLoadedDraft(true)); }, []);
  useEffect(() => { if (hasLoadedDraft) void AsyncStorage.setItem(key, JSON.stringify(draft)); }, [draft, hasLoadedDraft]);
  return { draft, hasLoadedDraft, setDraft };
}
