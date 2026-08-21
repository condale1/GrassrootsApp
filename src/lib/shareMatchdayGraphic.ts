import * as Sharing from "expo-sharing";
import { RefObject } from "react";
import { View } from "react-native";
import { captureRef } from "react-native-view-shot";

export async function shareMatchdayGraphic(target: RefObject<View | null>) {
  if (!target.current || !(await Sharing.isAvailableAsync())) return false;

  const imageUri = await captureRef(target.current, { format: "png", quality: 1, result: "tmpfile" });
  await Sharing.shareAsync(imageUri, { mimeType: "image/png", UTI: "public.png" });
  return true;
}
