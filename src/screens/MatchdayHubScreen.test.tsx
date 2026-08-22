import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { jest } from "@jest/globals";
import { Text } from "react-native";
import { MatchdayHubScreen } from "./MatchdayHubScreen";

describe("MatchdayHubScreen", () => {
  it("starts on the board and switches matchday tools", async () => {
    const onSectionChange = jest.fn();
    const screen = await render(<MatchdayHubScreen board={<Text>Board content</Text>} gameTime={<Text>Game time content</Text>} onSectionChange={onSectionChange} timer={<Text>Timer content</Text>} />);

    expect(screen.getByText("Board content")).toBeTruthy();
    fireEvent.press(screen.getByLabelText("Open Timer"));
    await waitFor(() => expect(screen.getByText("Timer content")).toBeTruthy());
    expect(onSectionChange).toHaveBeenCalled();
  });
});
