export type Formation = { description: string; dots: { x: number; y: number }[]; name: string };
export type RuleReference = { label: string; detail: string };
export type AgeGroupGuidance = {
  age: string;
  ballSize: string;
  dailyMinutes: number;
  equipment: string[];
  formations: Formation[];
  format: string;
  goalArea: string;
  goalSize: string;
  hasGoalkeeper: boolean;
  markings: string[];
  matchDuration: string;
  maxMinutes: number;
  pitchLength: number;
  pitchMaximum: string;
  pitchMinimum: string;
  pitchRecommended: string;
  pitchWidth: number;
  ruleNotes: string[];
  rules: RuleReference[];
};

export const faGuidanceVersion = "FA Youth Football Guidance - 2026/27 Season";
export const faSourceUrl = "https://www.thefa.com/-/media/cfa/kentfa/files/players/futurefit/july-2026/futurefit-format-overview.ashx";

type FormatRow = readonly [number, string, string, number, number, string, string, string, string, number, number];

const formats: FormatRow[] = [
  [7, "3v3", "Size 3", 15, 10, "15 x 10m", "15 x 10m", "20 x 15m", "4 x 2.5ft", 30, 60],
  [8, "5v5", "Size 3", 37, 27, "37 x 27m", "27 x 18m", "37 x 27m", "12 x 6ft", 40, 60],
  [9, "5v5", "Size 3", 37, 27, "37 x 27m", "27 x 18m", "37 x 27m", "12 x 6ft", 40, 60],
  [10, "7v7", "Size 3", 55, 37, "55 x 37m", "46 x 27m", "55 x 37m", "12 x 6ft", 50, 90],
  [11, "7v7", "Size 3", 55, 37, "46 x 27m", "46 x 27m", "55 x 37m", "12 x 6ft", 50, 90],
  [12, "9v9", "Size 4", 73, 46, "73 x 46m", "64 x 37m", "73 x 46m", "16 x 7ft", 60, 120],
  [13, "9v9", "Size 4", 73, 46, "73 x 46m", "64 x 37m", "73 x 46m", "16 x 7ft", 60, 120],
  [14, "11v11", "Size 5", 82, 50, "82 x 50m", "82 x 46m", "91 x 55m", "21 x 7ft", 70, 150],
  [15, "11v11", "Size 5", 91, 55, "91 x 55m", "82 x 46m", "100 x 64m", "24 x 8ft", 70, 150],
  [16, "11v11", "Size 5", 91, 55, "91 x 55m", "82 x 46m", "100 x 64m", "24 x 8ft", 80, 150],
  [17, "11v11", "Size 5", 100, 64, "100 x 64m", "91 x 46m", "118 x 91m", "24 x 8ft", 90, 180],
  [18, "11v11", "Size 5", 100, 64, "100 x 64m", "91 x 46m", "118 x 91m", "24 x 8ft", 90, 180]
];

function formationsFor(format: string): Formation[] {
  if (format === "3v3") return [{ name: "2-1", description: "Two players support behind one higher player. Rotate roles often.", dots: [{ x: 20, y: 28 }, { x: 20, y: 72 }, { x: 66, y: 50 }] }];
  if (format === "5v5") return [{ name: "1-2-1", description: "A simple diamond that offers width and a central passing option.", dots: [{ x: 12, y: 50 }, { x: 37, y: 25 }, { x: 37, y: 75 }, { x: 62, y: 50 }, { x: 85, y: 50 }] }];
  if (format === "7v7") return [{ name: "2-3-1", description: "A balanced shape with natural width and one player ahead.", dots: [{ x: 10, y: 50 }, { x: 28, y: 30 }, { x: 28, y: 70 }, { x: 50, y: 20 }, { x: 50, y: 50 }, { x: 50, y: 80 }, { x: 82, y: 50 }] }];
  if (format === "9v9") return [{ name: "3-3-2", description: "Three clear lines help players understand support and cover.", dots: [{ x: 9, y: 50 }, { x: 27, y: 22 }, { x: 27, y: 50 }, { x: 27, y: 78 }, { x: 51, y: 22 }, { x: 51, y: 50 }, { x: 51, y: 78 }, { x: 78, y: 33 }, { x: 78, y: 67 }] }];
  return [{ name: "4-3-3", description: "A familiar three-line shape. Adapt positions to the players, not the other way round.", dots: [{ x: 8, y: 50 }, { x: 26, y: 18 }, { x: 26, y: 39 }, { x: 26, y: 61 }, { x: 26, y: 82 }, { x: 50, y: 25 }, { x: 50, y: 50 }, { x: 50, y: 75 }, { x: 79, y: 20 }, { x: 82, y: 50 }, { x: 79, y: 80 }] }];
}

function rulesFor(age: number, format: string): RuleReference[] {
  const youthRules: RuleReference[] = [
    { label: "Substitutions", detail: "Rolling substitutions are permitted. Plan them so every player has meaningful involvement." },
    { label: "Heading", detail: age <= 11 ? "Deliberate heading is not permitted in affiliated matches." : "Check current competition guidance before matchday." },
    { label: "Free kicks", detail: "Use the competition's small-sided or standard Laws. Ask the referee if a local variation applies." }
  ];
  if (format === "3v3") return [{ label: "Goalkeepers", detail: "There are no goalkeepers in 3v3." }, { label: "Restarts", detail: "Use pass-ins or dribble-ins rather than throw-ins, following the competition format." }, { label: "Offside", detail: "Offside is not used." }, ...youthRules];
  if (age <= 11) return [{ label: "Offside", detail: "Offside is not used in this mini-soccer format." }, { label: "Restarts", detail: "Pass-ins or dribble-ins replace throw-ins." }, { label: "Retreat line", detail: "Opponents retreat to the halfway line for a goal kick until the ball is in play." }, { label: "Goalkeepers", detail: "The goalkeeper restarts with a goal kick; check your competition's handling and distribution rules." }, ...youthRules];
  return [{ label: "Offside", detail: "Standard offside applies." }, { label: "Restarts", detail: "Standard throw-ins, goal kicks and corners apply." }, { label: "Goalkeepers", detail: "Standard Laws apply; local competition rules may add development guidance." }, ...youthRules];
}

function markingsFor(age: number, format: string): string[] {
  if (format === "3v3") return ["Touchlines and goal lines", "Halfway line and centre spot", "Goal positions", "Corner areas if used by the competition"];
  if (age <= 11) return ["Touchlines and goal lines", "Halfway line, centre spot and centre circle", "Goal areas and goal positions", "Corner areas", "Halfway line used as the retreat line"];
  return ["Touchlines and goal lines", "Halfway line, centre spot and centre circle", "Penalty areas and penalty spots", "Corner areas", "Goal positions"];
}

function equipmentFor(format: string, hasGoalkeeper: boolean): string[] {
  return ["Correct-size match balls", "Ball pump and needle", "Bibs and cones or pitch markers", "Safe, anchored or weighted goals", ...(hasGoalkeeper ? ["Goalkeeper shirt and gloves"] : []), "First-aid kit", "Respect barrier or spectator line", ...(format === "3v3" ? ["Small pop-up goals or marked scoring zones"] : [])];
}

function goalAreaFor(format: string): string {
  if (format === "7v7") return "3m deep x 9m wide";
  if (format === "9v9") return "4m deep x 12m wide";
  if (format === "11v11") return "5.5m deep x 18.32m wide";
  return "No prescribed goal area";
}

export const ageGroupGuidance: AgeGroupGuidance[] = formats.map(([age, format, ballSize, pitchLength, pitchWidth, recommended, minimum, maximum, goalSize, maxMinutes, dailyMinutes]) => {
  const hasGoalkeeper = format !== "3v3";
  return {
    age: `U${age}`,
    ballSize,
    dailyMinutes,
    equipment: equipmentFor(format, hasGoalkeeper),
    formations: formationsFor(format),
    format,
    goalArea: goalAreaFor(format),
    goalSize,
    hasGoalkeeper,
    markings: markingsFor(age, format),
    matchDuration: `Up to ${maxMinutes} min`,
    maxMinutes,
    pitchLength,
    pitchMaximum: maximum,
    pitchMinimum: minimum,
    pitchRecommended: recommended,
    pitchWidth,
    ruleNotes: rulesFor(age, format).map((rule) => `${rule.label}: ${rule.detail}`),
    rules: rulesFor(age, format)
  };
});

export function findAgeGroupGuidance(ageGroup: string) { return ageGroupGuidance.find((group) => group.age === ageGroup) ?? ageGroupGuidance[1]; }

export function pitchDiagonal(length: number, width: number) { return Math.sqrt(length ** 2 + width ** 2); }
