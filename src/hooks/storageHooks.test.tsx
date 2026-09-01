import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import { afterEach, describe, expect, it, jest } from "@jest/globals";

import { useAgeGroup } from "./useAgeGroup";
import { useMatchdayBoard } from "./useMatchdayBoard";
import { useSessionBuilder } from "./useSessionBuilder";
import { useSquad } from "./useSquad";

jest.mock("@react-native-async-storage/async-storage", () => require("@react-native-async-storage/async-storage/jest/async-storage-mock"));

const storage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

afterEach(() => {
  jest.clearAllMocks();
});

describe("persisted coach data", () => {
  it("restores and updates the selected age group", async () => {
    storage.getItem.mockResolvedValue("U10");
    const { result } = await renderHook(() => useAgeGroup());
    await waitFor(() => expect(result.current?.ageGroup).toBe("U10"));

    await act(() => result.current?.setAgeGroup("U11"));
    await waitFor(() => expect(storage.setItem).toHaveBeenLastCalledWith("grassroots-coach-tools-age-group", "U11"));
  });

  it("migrates saved squads and preserves optional player positions", async () => {
    storage.getItem.mockResolvedValue(JSON.stringify([{ id: "a", name: "Ava", available: false }]));
    const { result } = await renderHook(() => useSquad());
    await waitFor(() => expect(result.current?.hasLoadedSquad).toBe(true));
    expect(result.current?.players).toEqual([{ id: "a", name: "Ava", available: false }]);
    expect(result.current?.hasCompletedSetup).toBe(true);

    await act(() => result.current?.setPlayers((players) => players.map((player) => ({ ...player, available: true, position: "GK" }))));
    await waitFor(() => expect(storage.setItem).toHaveBeenLastCalledWith("grassroots-coach-tools-squad", JSON.stringify({ hasCompletedSetup: true, players: [{ id: "a", name: "Ava", available: true, position: "GK" }], teamName: "" })));
  });

  it("starts a first-time coach without placeholder players", async () => {
    storage.getItem.mockResolvedValue(null);
    const { result } = await renderHook(() => useSquad());

    await waitFor(() => expect(result.current?.hasLoadedSquad).toBe(true));
    expect(result.current?.hasCompletedSetup).toBe(false);
    expect(result.current?.players).toEqual([]);
  });

  it("restores the session plan and persists its title", async () => {
    storage.getItem.mockResolvedValue(JSON.stringify({ title: "Finishing", blocks: [{ id: "1", drillId: "traffic-lights", minutes: 10 }] }));
    const { result } = await renderHook(() => useSessionBuilder());
    await waitFor(() => expect(result.current?.hasLoadedDraft).toBe(true));
    expect(result.current?.draft.title).toBe("Finishing");
    expect(result.current?.draft.customDrills).toEqual([]);

    await act(() => result.current?.setDraft((draft) => ({ ...draft, title: "Defending" })));
    await waitFor(() => expect(storage.setItem).toHaveBeenLastCalledWith("grassroots-coach-tools-session-draft", JSON.stringify({ title: "Defending", blocks: [{ id: "1", drillId: "traffic-lights", minutes: 10 }], customDrills: [] })));
  });

  it("keeps matchday details and checklist progress on-device", async () => {
    storage.getItem.mockResolvedValue(JSON.stringify({ opponent: "Rovers", venue: "Home", kickoff: "10:30", focus: "Play forward", checks: [{ id: "kit", label: "Balls", done: false }] }));
    const { result } = await renderHook(() => useMatchdayBoard());
    await waitFor(() => expect(result.current?.hasLoadedMatchday).toBe(true));
    expect(result.current?.draft.opponent).toBe("Rovers");
    expect(result.current?.draft.matchDate).toBe("");

    await act(() => result.current?.setDraft((draft) => ({ ...draft, checks: [{ ...draft.checks[0], done: true }] })));
    await waitFor(() => expect(storage.setItem).toHaveBeenLastCalledWith("grassroots-coach-tools-matchday-board", JSON.stringify({ opponent: "Rovers", venue: "Home", kickoff: "10:30", focus: "Play forward", checks: [{ id: "kit", label: "Balls", done: true }], matchDate: "" })));
  });
});
