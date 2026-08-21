export type Player = {
  available: boolean;
  id: string;
  name: string;
};

export type AppTab = "gameTime" | "matchday" | "sessions" | "toolbox";

export type SessionBlock = { drillId: string; id: string; minutes: number };
export type SessionDraft = { blocks: SessionBlock[]; title: string };

export type MatchdayCheck = { done: boolean; id: string; label: string };
export type MatchdayDraft = { checks: MatchdayCheck[]; focus: string; kickoff: string; opponent: string; venue: string };
