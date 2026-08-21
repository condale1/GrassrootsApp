import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import * as Sharing from "expo-sharing";
import { captureRef } from "react-native-view-shot";
import { RefObject } from "react";
import { View } from "react-native";

import { shareMatchdayGraphic } from "./shareMatchdayGraphic";

describe("shareMatchdayGraphic", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("captures a PNG and opens the native share sheet", async () => {
    jest.mocked(Sharing.isAvailableAsync).mockResolvedValue(true);
    jest.mocked(captureRef).mockResolvedValue("file:///tmp/matchday.png");
    const target = { current: {} as View } as RefObject<View | null>;

    await expect(shareMatchdayGraphic(target)).resolves.toBe(true);
    expect(captureRef).toHaveBeenCalledWith(target.current, { format: "png", quality: 1, result: "tmpfile" });
    expect(Sharing.shareAsync).toHaveBeenCalledWith("file:///tmp/matchday.png", { mimeType: "image/png", UTI: "public.png" });
  });

  it("does not attempt capture when sharing is unavailable", async () => {
    jest.mocked(Sharing.isAvailableAsync).mockResolvedValue(false);
    await expect(shareMatchdayGraphic({ current: {} as View } as RefObject<View | null>)).resolves.toBe(false);
    expect(captureRef).not.toHaveBeenCalled();
  });
});
