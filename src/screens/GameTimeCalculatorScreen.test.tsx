import { render } from "@testing-library/react-native";
import { GameTimeCalculatorScreen } from "./GameTimeCalculatorScreen";

describe("GameTimeCalculatorScreen", () => {
  it("offers a shareable rotation plan when a matchday squad is available", async () => {
    const screen = await render(<GameTimeCalculatorScreen players={[{ id: "1", name: "Ava", available: true }, { id: "2", name: "Noah", available: true }, { id: "3", name: "Mia", available: true }]} />);

    expect(screen.getByLabelText("Share rotation plan")).toBeTruthy();
    expect(screen.getByText("GRASSROOTS FC")).toBeTruthy();
  });
});
