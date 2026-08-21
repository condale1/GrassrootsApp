import { RefObject } from "react";
import { ScrollView } from "react-native";

export function resetScrollPosition(scrollView: RefObject<ScrollView | null>) {
  scrollView.current?.scrollTo({ animated: false, y: 0 });
}
