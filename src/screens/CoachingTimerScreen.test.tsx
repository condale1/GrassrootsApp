import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { CoachingTimerScreen } from "./CoachingTimerScreen";

describe("CoachingTimerScreen", () => {
  it("switches to interval configuration and starts the first work round", async () => {
    const screen = await render(<CoachingTimerScreen />);

    fireEvent.press(screen.getByLabelText("Select Intervals timer"));
    await waitFor(() => expect(screen.getByText("Set intervals")).toBeTruthy());
    fireEvent.press(screen.getByLabelText("Start timer"));

    await waitFor(() => expect(screen.getByText("WORK")).toBeTruthy());
    expect(screen.getByText("Round 1 of 4")).toBeTruthy();
    expect(screen.getByLabelText("Pause timer")).toBeTruthy();
  });
});
