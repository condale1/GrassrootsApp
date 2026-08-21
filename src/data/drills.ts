export type Drill = { category: string; defaultMinutes: number; description: string; equipment: string; id: string; title: string };

export const drills: Drill[] = [
  { id: "traffic-lights", title: "Traffic Lights", category: "Arrival", defaultMinutes: 10, description: "Players dribble freely and respond to traffic-light calls.", equipment: "One ball each, cones" },
  { id: "pirate-treasure", title: "Pirate Treasure", category: "Ball mastery", defaultMinutes: 12, description: "Steal balls from the treasure island and return them to base.", equipment: "Balls, cones, bibs" },
  { id: "gates-and-goals", title: "Gates & Goals", category: "Passing", defaultMinutes: 12, description: "Pairs score by passing through as many small gates as they can.", equipment: "Balls, cones" },
  { id: "numbers-game", title: "Numbers Game", category: "Decision making", defaultMinutes: 15, description: "Call a number to send players into quick small-sided challenges.", equipment: "Balls, bibs, two goals" },
  { id: "sharks-and-minnows", title: "Sharks & Minnows", category: "Fun game", defaultMinutes: 10, description: "Dribblers cross the sea while sharks try to win their ball.", equipment: "One ball each, cones" },
  { id: "mini-match", title: "Mini Match", category: "Game", defaultMinutes: 15, description: "Finish with a simple small-sided match and one clear focus.", equipment: "Balls, bibs, goals" }
];

export function findDrill(id: string) { return drills.find((drill) => drill.id === id) ?? drills[0]; }
