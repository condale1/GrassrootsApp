import { describe, expect, it, jest } from "@jest/globals";
import { act, fireEvent, render } from "@testing-library/react-native";

import { TabBar } from "./TabBar";

describe("TabBar", () => {
  it("exposes Matchday and Training and changes to them when selected", async () => {
    const onChange = jest.fn();
    const screen = await render(<TabBar activeTab="matchday" onChange={onChange} />);
    await act(() => fireEvent.press(screen.getByText("Matchday")));
    expect(onChange).toHaveBeenCalledWith("matchday");
    await act(() => fireEvent.press(screen.getByText("Training")));
    expect(onChange).toHaveBeenCalledWith("sessions");
  });
});
