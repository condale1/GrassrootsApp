import { describe, expect, it, jest } from "@jest/globals";

import { resetScrollPosition } from "./scroll";

describe("resetScrollPosition", () => {
  it("returns a newly selected screen to its top without animation", () => {
    const scrollTo = jest.fn();
    resetScrollPosition({ current: { scrollTo } } as never);
    expect(scrollTo).toHaveBeenCalledWith({ animated: false, y: 0 });
  });

  it("does nothing before the scroll view mounts", () => {
    expect(() => resetScrollPosition({ current: null })).not.toThrow();
  });
});
