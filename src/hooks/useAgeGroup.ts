import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const AGE_GROUP_STORAGE_KEY = "grassroots-coach-tools-age-group";

export function useAgeGroup() {
  const [ageGroup, setAgeGroup] = useState("U8");
  const [hasLoadedAgeGroup, setHasLoadedAgeGroup] = useState(false);

  useEffect(() => {
    async function loadAgeGroup() {
      try {
        const savedAgeGroup = await AsyncStorage.getItem(AGE_GROUP_STORAGE_KEY);
        if (savedAgeGroup) setAgeGroup(savedAgeGroup);
      } finally {
        setHasLoadedAgeGroup(true);
      }
    }

    void loadAgeGroup();
  }, []);

  useEffect(() => {
    if (hasLoadedAgeGroup) void AsyncStorage.setItem(AGE_GROUP_STORAGE_KEY, ageGroup);
  }, [ageGroup, hasLoadedAgeGroup]);

  return { ageGroup, setAgeGroup };
}
