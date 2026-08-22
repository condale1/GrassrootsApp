import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { jest } from "@jest/globals";
import { CoachToolboxScreen } from "./CoachToolboxScreen";

describe("CoachToolboxScreen", () => {
  it("keeps the selected age group while opening pitch setup", async () => {
    const setAgeGroup = jest.fn();
    const screen = await render(<CoachToolboxScreen ageGroup="U10" setAgeGroup={setAgeGroup} />);

    fireEvent.press(screen.getByLabelText("Open Pitch setup"));
    await waitFor(() => expect(screen.getByLabelText("Pitch diagram")).toBeTruthy());
    expect(screen.getAllByText("55 x 37m")).toHaveLength(2);

    fireEvent.press(screen.getByLabelText("Select U11"));
    expect(setAgeGroup).toHaveBeenCalledWith("U11");
  });
});
