import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { App } from "./App";
import { initialData } from "./initial-data";
import { useAthleteRaceResults } from "./hooks/use-athlete-race-results";
import type { AthleteRaceResult } from "./entities/athlete-race-result";

vi.mock("./hooks/use-athlete-race-results", () => ({
  useAthleteRaceResults: vi.fn(),
}));

const mockUseAthleteRaceResults = vi.mocked(useAthleteRaceResults);

afterEach(() => {
  vi.clearAllMocks();
});

describe("App", () => {
  it("shows the seeded results before any search is submitted", () => {
    mockUseAthleteRaceResults.mockReturnValue({
      data: initialData,
      loading: false,
      error: false,
    });

    render(<App />);

    const firstSeed = initialData[0];
    if (!firstSeed)
      throw new Error("initialResults must contain at least one entry.");
    const seededName = `${firstSeed.athlete.lastName} ${firstSeed.athlete.firstName}`;
    expect(screen.getByText(seededName)).toBeInTheDocument();
  });

  it("displays the loading button state while data is fetching", async () => {
    const user = userEvent.setup();
    mockUseAthleteRaceResults.mockReturnValue({
      data: initialData,
      loading: true,
      error: false,
    });

    render(<App />);

    await user.type(
      screen.getByPlaceholderText("Cerca il tuo nome o il nome di una gara"),
      "kip",
    );

    const button = screen.getByRole("button", { name: "Cerca" });
    expect(button).toHaveClass("loading-search-button");
    expect(button).toBeDisabled();
  });

  it("shows the retry button style when the last request failed", async () => {
    const user = userEvent.setup();
    mockUseAthleteRaceResults.mockReturnValue({
      data: initialData,
      loading: false,
      error: true,
    });

    render(<App />);

    await user.type(
      screen.getByPlaceholderText("Cerca il tuo nome o il nome di una gara"),
      "kip",
    );

    const button = screen.getByRole("button", { name: "Riprova" });
    expect(button).toHaveClass("retry-search-button");
    expect(button).toBeEnabled();
  });

  it("replaces initial results with fetched data after a search", async () => {
    const user = userEvent.setup();
    const fetchedResults: AthleteRaceResult[] = [
      {
        id: "remote-id",
        timeSeconds: 3600,
        gapSeconds: 0,
        paceMinKm: 210,
        athlete: {
          id: "athlete-remote-id",
          firstName: "Brigid",
          lastName: "Kosgei",
          gender: "F",
          yearOfBirth: 1994,
        },
        race: {
          id: "race-id",
          name: "City Marathon",
          date: new Date("2024-01-01"),
        },
        category: "SF",
        bibNumber: 100,
        sportsClub: "Nike Run Club",
        position: 1,
      },
    ];

    mockUseAthleteRaceResults.mockImplementation(
      (searchString: string, seed: AthleteRaceResult[]) =>
        searchString
          ? { data: fetchedResults, loading: false, error: false }
          : { data: seed, loading: false, error: false },
    );

    render(<App />);

    await user.type(
      screen.getByPlaceholderText("Cerca il tuo nome o il nome di una gara"),
      "brigid",
    );
    await user.click(screen.getByRole("button", { name: "Cerca" }));

    const firstSeed = initialData[0];
    if (!firstSeed)
      throw new Error("initialResults must contain at least one entry.");
    const seededAthleteName = `${firstSeed.athlete.lastName} ${firstSeed.athlete.firstName}`;

    expect(
      screen.getByText("Kosgei Brigid", { exact: false }),
    ).toBeInTheDocument();
    expect(screen.queryByText(seededAthleteName)).not.toBeInTheDocument();
  });
});
