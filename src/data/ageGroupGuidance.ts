export type AgeGroupGuidance = {
  age: string;
  ballSize: string;
  dailyMinutes: number;
  format: string;
  goalSize: string;
  maxMinutes: number;
  pitchMaximum: string;
  pitchMinimum: string;
  pitchRecommended: string;
  ruleNotes: string[];
};

const commonYouthRules = ["Rolling substitutions", "All pitches should have a minimum 3m run-off area"];

function rulesFor(age: number): string[] {
  const rules = [...commonYouthRules];

  if (age <= 11) rules.unshift("Deliberate heading is not permitted in affiliated matches");
  if (age >= 8 && age <= 11) rules.unshift("Pass or dribble-ins are used instead of throw-ins", "Retreat line applies on opposition goal kicks");
  if (age <= 11) rules.push("No league tables at this age group");
  if (age >= 12) rules.unshift("Standard throw-ins apply");
  return rules;
}

const formats = [
  [7, "3v3", "3", "15 x 10m", "15 x 10m", "20 x 15m", "4 x 2.5ft", 10, 60],
  [8, "5v5", "3", "37 x 27m", "27 x 18m", "37 x 27m", "12 x 6ft", 40, 60],
  [9, "5v5", "3", "37 x 27m", "27 x 18m", "37 x 27m", "12 x 6ft", 40, 60],
  [10, "7v7", "3", "55 x 37m", "46 x 27m", "55 x 37m", "12 x 6ft", 50, 90],
  [11, "7v7", "3", "55 x 37m", "46 x 27m", "55 x 37m", "12 x 6ft", 50, 90],
  [12, "9v9", "4", "73 x 46m", "64 x 37m", "73 x 46m", "16 x 7ft", 60, 120],
  [13, "9v9", "4", "73 x 46m", "64 x 37m", "73 x 46m", "16 x 7ft", 60, 120],
  [14, "11v11", "5", "82 x 50m", "82 x 46m", "91 x 55m", "21 x 7ft", 70, 150],
  [15, "11v11", "5", "91 x 55m", "82 x 46m", "100 x 64m", "24 x 8ft", 70, 150],
  [16, "11v11", "5", "91 x 55m", "82 x 46m", "100 x 64m", "24 x 8ft", 80, 150],
  [17, "11v11", "5", "100 x 64m", "91 x 46m", "118 x 91m", "24 x 8ft", 90, 180],
  [18, "11v11", "5", "100 x 64m", "91 x 46m", "118 x 91m", "24 x 8ft", 90, 180]
] as const;

export const ageGroupGuidance: AgeGroupGuidance[] = formats.map(([age, format, ballSize, recommended, minimum, maximum, goalSize, maxMinutes, dailyMinutes]) => ({
  age: `U${age}`,
  ballSize: `Size ${ballSize}`,
  dailyMinutes,
  format,
  goalSize,
  maxMinutes,
  pitchMaximum: maximum,
  pitchMinimum: minimum,
  pitchRecommended: recommended,
  ruleNotes: rulesFor(age)
}));

export const faSourceUrl = "https://www.thefa.com/-/media/cfa/kentfa/files/players/futurefit/july-2026/futurefit-format-overview.ashx";
