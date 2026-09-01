import { fireEvent, render } from "@testing-library/react-native";
import { Linking } from "react-native";

import { PrivacyPolicyScreen } from "./PrivacyPolicyScreen";

jest.spyOn(Linking, "openURL").mockResolvedValue(true);

describe("PrivacyPolicyScreen", () => {
  it("explains local storage and opens the privacy contact email", async () => {
    const screen = await render(<PrivacyPolicyScreen />);

    expect(screen.getByText("What Benchside stores")).toBeTruthy();
    expect(
      screen.getByText(/does not use accounts, analytics, advertising/),
    ).toBeTruthy();

    fireEvent.press(screen.getByLabelText("Email Benchside privacy support"));

    expect(Linking.openURL).toHaveBeenCalledWith(
      "mailto:condale1@googlemail.com",
    );
  });
});
