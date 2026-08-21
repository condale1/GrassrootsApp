import { describe, expect, it } from "@jest/globals";

import { ageGroupGuidance } from "./ageGroupGuidance";

describe("age group guidance", () => {
  it("includes the U8 retreat-line and pass-in rules", () => {
    const u8 = ageGroupGuidance.find((guidance) => guidance.age === "U8");
    expect(u8).toMatchObject({ ballSize: "Size 3", format: "5v5", pitchRecommended: "37 x 27m" });
    expect(u8?.ruleNotes).toEqual(expect.arrayContaining(["Retreat line applies on opposition goal kicks", "Pass or dribble-ins are used instead of throw-ins"]));
  });

  it("uses standard throw-ins for older age groups", () => {
    const u12 = ageGroupGuidance.find((guidance) => guidance.age === "U12");
    expect(u12?.ruleNotes).toContain("Standard throw-ins apply");
  });
});
