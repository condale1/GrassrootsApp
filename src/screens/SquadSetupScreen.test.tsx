import { fireEvent, render } from "@testing-library/react-native";
import { useState } from "react";

import { Player } from "../types";
import { SquadSetupScreen } from "./SquadSetupScreen";

function SetupHarness({ onComplete }: { onComplete: () => void }) {
  const [players, setPlayers] = useState<Player[]>([
    { available: true, id: "ava", name: "Ava" },
  ]);
  const [teamName, setTeamName] = useState("Oakwood U10s");
  return <SquadSetupScreen onComplete={onComplete} players={players} setPlayers={setPlayers} setTeamName={setTeamName} teamName={teamName} />;
}

describe("SquadSetupScreen", () => {
  it("allows setup without assigning a player position", async () => {
    const onComplete = jest.fn();
    const screen = await render(<SetupHarness onComplete={onComplete} />);

    expect(screen.getByText("Positions are optional")).toBeTruthy();
    fireEvent.press(screen.getByText("Start using Benchside"));

    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
