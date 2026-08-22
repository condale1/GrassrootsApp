import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import { useState } from "react";
import { SessionBuilderScreen } from "./SessionBuilderScreen";
import { SessionDraft } from "../types";

const initialDraft: SessionDraft = {
  title: "Finishing",
  blocks: [{ id: "1", drillId: "pirate-treasure", minutes: 12 }],
  customDrills: []
};

function TestScreen() {
  const [draft, setDraft] = useState(initialDraft);
  return <SessionBuilderScreen ageGroup="U10" draft={draft} hasLoadedDraft setDraft={setDraft} />;
}

describe("SessionBuilderScreen", () => {
  it("adjusts a 12 minute drill one minute at a time", async () => {
    const screen = await render(<TestScreen />);

    await act(() => fireEvent.press(screen.getByLabelText("Decrease Pirate Treasure duration")));

    await waitFor(() => expect(screen.getByText("11m")).toBeTruthy());
  });

  it("saves a custom drill and makes it available to add", async () => {
    const screen = await render(<TestScreen />);

    await act(() => fireEvent.changeText(screen.getByLabelText("Custom drill title"), "Corner Rondo"));
    await act(() => fireEvent.changeText(screen.getByLabelText("Custom drill category"), "Passing"));
    await act(() => fireEvent.changeText(screen.getByLabelText("Custom drill duration"), "8"));
    await act(() => fireEvent.changeText(screen.getByLabelText("Custom drill description"), "Keep possession under pressure."));
    await act(() => fireEvent.changeText(screen.getByLabelText("Custom drill equipment"), "Balls and bibs"));
    await act(() => fireEvent.press(screen.getByLabelText("Save custom drill")));

    await waitFor(() => expect(screen.getByText("Corner Rondo")).toBeTruthy());
    await act(() => fireEvent.press(screen.getByLabelText("Add Corner Rondo to session")));
    await waitFor(() => expect(screen.getByText("8m")).toBeTruthy());
  });
});
