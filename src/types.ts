export type Player = {
  available: boolean;
  id: string;
  name: string;
};

export type AppTab = "matchday" | "sessions" | "toolbox";

export type SessionBlock = { drillId: string; id: string; minutes: number };
export type Drill = { category: string; defaultMinutes: number; description: string; equipment: string; id: string; title: string };
export type SessionDraft = { blocks: SessionBlock[]; customDrills: Drill[]; title: string };

export type MatchdayCheck = { done: boolean; id: string; label: string };
export type MatchdayDraft = { checks: MatchdayCheck[]; focus: string; kickoff: string; matchDate: string; opponent: string; venue: string };
