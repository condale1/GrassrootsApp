import { describe, expect, it } from "@jest/globals";

import { ageGroupGuidance, pitchDiagonal } from "./ageGroupGuidance";

describe("age group guidance", () => {
  it("includes the U8 retreat-line and pass-in rules", () => {
    const u8 = ageGroupGuidance.find((guidance) => guidance.age === "U8");
    expect(u8).toMatchObject({ ballSize: "Size 3", format: "5v5", pitchRecommended: "37 x 27m" });
    expect(u8?.ruleNotes).toEqual(expect.arrayContaining(["Retreat line: Opponents retreat to the halfway line for a goal kick until the ball is in play.", "Restarts: Pass-ins or dribble-ins replace throw-ins."]));
  });

  it("uses standard throw-ins for older age groups", () => {
    const u12 = ageGroupGuidance.find((guidance) => guidance.age === "U12");
    expect(u12?.ruleNotes).toContain("Restarts: Standard throw-ins, goal kicks and corners apply.");
  });

  it("uses the 2026/27 Future Fit pathway and calculates the pitch diagonal", () => {
    expect(ageGroupGuidance.find((guidance) => guidance.age === "U7")?.format).toBe("3v3");
    expect(ageGroupGuidance.find((guidance) => guidance.age === "U13")?.format).toBe("9v9");
    expect(pitchDiagonal(15, 10)).toBeCloseTo(18.03, 2);
    expect(ageGroupGuidance.find((guidance) => guidance.age === "U10")?.goalArea).toBe("3m deep x 9m wide");
  });
});
