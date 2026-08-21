export type Player = {
  available: boolean;
  id: string;
  name: string;
};

export type AppTab = "gameTime" | "sessions" | "toolbox";

export type SessionBlock = { drillId: string; id: string; minutes: number };
export type SessionDraft = { blocks: SessionBlock[]; title: string };
