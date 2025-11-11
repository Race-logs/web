import { describe, expect, it } from "vitest";

import { formatTime } from "./format-time";

describe("formatTime", () => {
  it("formats minutes and seconds without milliseconds when under an hour", () => {
    expect(formatTime(90)).toBe(`1'30"`);
  });

  it("includes hours with padded minutes/seconds and milliseconds", () => {
    expect(formatTime(3723.456)).toBe(`1:02'03".456`);
  });

  it("rounds to the nearest millisecond and omits decimals when unnecessary", () => {
    expect(formatTime(3599.9996)).toBe(`1:00'00"`);
  });
});
