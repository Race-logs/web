import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useFetchData } from "./use-fetch-data";
import type { AthleteRaceResult } from "../entities/athlete-race-result";
import type { UseFetchResultType } from "./use-fetch-data";

vi.mock("./use-fetch-data", () => ({
  useFetchData: vi.fn(),
}));

const mockUseFetchData = vi.mocked(useFetchData);

const loadHook = async () =>
  (await import("./use-athlete-race-results")).useAthleteRaceResults;

afterEach(() => {
  vi.clearAllMocks();
  vi.unstubAllEnvs();
  vi.resetModules();
});

const seedResults: AthleteRaceResult[] = [
  {
    id: "seed",
    timeSeconds: 1,
    gapSeconds: 0,
    paceMinKm: 1,
    athlete: {
      id: "athlete-seed",
      firstName: "Seed",
      lastName: "Runner",
      gender: "M",
      yearOfBirth: 2000,
    },
    race: {
      id: "race-seed",
      name: "Seed Race",
      date: new Date("2024-01-01"),
    },
    category: "SM",
    bibNumber: 1,
    sportsClub: "Club",
    position: 1,
  },
];

describe("useAthleteRaceResults", () => {
  it("composes the race results endpoint with the configured API URL", async () => {
    vi.resetModules();
    const expectedResult: UseFetchResultType<AthleteRaceResult[]> = {
      data: seedResults,
      loading: false,
      error: false,
    };
    mockUseFetchData.mockReturnValue(expectedResult);
    vi.stubEnv("VITE_API_URL", "https://api.example.com");

    const useAthleteRaceResults = await loadHook();
    const { result } = renderHook(() =>
      useAthleteRaceResults("kip", seedResults),
    );

    expect(mockUseFetchData).toHaveBeenCalledWith(
      "https://api.example.com/race-results",
      "kip",
      seedResults,
    );
    expect(result.current).toBe(expectedResult);
  });

  it("passes through the search string unchanged", async () => {
    vi.resetModules();
    const expectedResult: UseFetchResultType<AthleteRaceResult[]> = {
      data: seedResults,
      loading: false,
      error: false,
    };
    mockUseFetchData.mockReturnValue(expectedResult);
    vi.stubEnv("VITE_API_URL", "https://api.example.com");

    const useAthleteRaceResults = await loadHook();
    renderHook(() => useAthleteRaceResults("  mixed Case Query ", seedResults));

    expect(mockUseFetchData).toHaveBeenCalledWith(
      "https://api.example.com/race-results",
      "  mixed Case Query ",
      seedResults,
    );
  });
});
