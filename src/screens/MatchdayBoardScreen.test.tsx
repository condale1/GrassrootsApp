import { fireEvent, render } from "@testing-library/react-native";
import { describe, expect, it, jest } from "@jest/globals";

import { MatchdayBoardScreen } from "./MatchdayBoardScreen";
import { MatchdayDraft } from "../types";

const draft: MatchdayDraft = {
  opponent: "Wanderers",
  matchDate: "Saturday 23 August",
  venue: "Home",
  kickoff: "10:30",
  focus: "Receive and play forward",
  checks: [{ id: "kit", label: "Balls, bibs and pump", done: false }]
};

describe("MatchdayBoardScreen", () => {
  it("shows only available players and toggles the departure checklist", async () => {
    let currentDraft = draft;
    const setDraft = jest.fn((updater: React.SetStateAction<MatchdayDraft>) => {
      currentDraft = typeof updater === "function" ? updater(currentDraft) : updater;
    });
    const screen = await render(<MatchdayBoardScreen draft={currentDraft} hasLoadedMatchday players={[{ id: "ava", name: "Ava", available: true }, { id: "sam", name: "Sam", available: false }]} setDraft={setDraft} />);

    expect(screen.getByText("1 available")).toBeTruthy();
    expect(screen.getAllByText("Ava")).toHaveLength(2);
    expect(screen.queryByText("Sam")).toBeNull();
    fireEvent.press(screen.getByRole("checkbox"));
    expect(currentDraft.checks[0].done).toBe(true);
  });
});
