import { render } from "@testing-library/react-native";

import { SupportUsScreen } from "./SupportUsScreen";

describe("SupportUsScreen", () => {
  it("explains that Benchside remains free and support is optional", async () => {
    const screen = await render(<SupportUsScreen />);

    expect(screen.getByText("Keep Benchside going")).toBeTruthy();
    expect(
      screen.getByText(/never charge for the use of Benchside/),
    ).toBeTruthy();
    expect(screen.getByText("Ko-fi link coming soon")).toBeTruthy();
  });
});
