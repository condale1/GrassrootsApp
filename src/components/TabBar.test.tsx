import { describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render } from "@testing-library/react-native";

import { TabBar } from "./TabBar";

describe("TabBar", () => {
  it("exposes Matchday and changes to it when selected", async () => {
    const onChange = jest.fn();
    const screen = await render(<TabBar activeTab="gameTime" onChange={onChange} />);
    fireEvent.press(screen.getByText("Matchday"));
    expect(onChange).toHaveBeenCalledWith("matchday");
  });
});
