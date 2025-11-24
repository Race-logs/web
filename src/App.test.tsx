import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "./App";
import { initialData } from "./initial-data";
import { useAthleteRaceResults } from "./hooks/use-athlete-race-results";
import { useMediaQuery } from "./hooks/use-media-query";
import type { AthleteRaceResult } from "./entities/athlete-race-result";

vi.mock("./hooks/use-athlete-race-results", () => ({
  useAthleteRaceResults: vi.fn(),
}));
vi.mock("./hooks/use-media-query", () => ({
  useMediaQuery: vi.fn(),
}));

const mockUseAthleteRaceResults = vi.mocked(useAthleteRaceResults);
const mockUseMediaQuery = vi.mocked(useMediaQuery);

afterEach(() => {
  vi.clearAllMocks();
});

describe("App", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/");
    mockUseMediaQuery.mockReturnValue(false);
  });

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
    const seededNameOccurrences = screen.getAllByText(seededName);
    expect(seededNameOccurrences.length).toBeGreaterThan(0);
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
    expect(button).toHaveClass("search-button__loading");
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
    expect(button).toHaveClass("search-button__retry");
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
          location: "Milan",
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

  it("hydrates the search input from the URL query param on load", () => {
    window.history.pushState({}, "", "/?q=brigid");
    mockUseAthleteRaceResults.mockReturnValue({
      data: initialData,
      loading: false,
      error: false,
    });

    render(<App />);

    const input = screen.getByPlaceholderText(
      "Cerca il tuo nome o il nome di una gara",
    );
    expect(input).toHaveValue("brigid");
    expect(mockUseAthleteRaceResults).toHaveBeenCalledWith(
      "brigid",
      initialData,
    );
  });

  it("writes the search term to the URL when a search is submitted", async () => {
    const user = userEvent.setup();
    mockUseAthleteRaceResults.mockReturnValue({
      data: initialData,
      loading: false,
      error: false,
    });

    render(<App />);

    const input = screen.getByPlaceholderText(
      "Cerca il tuo nome o il nome di una gara",
    );
    await user.type(input, "Valmalenco");
    await user.click(screen.getByRole("button", { name: /cerca/i }));

    expect(window.location.search).toBe("?q=Valmalenco");
  });

  it("renders the cards layout on mobile and the table layout on desktop", () => {
    mockUseAthleteRaceResults.mockReturnValue({
      data: initialData,
      loading: false,
      error: false,
    });

    mockUseMediaQuery.mockReturnValue(true);
    const { unmount } = render(<App />);
    expect(document.querySelector(".cards-list")).toBeInTheDocument();
    expect(document.querySelector(".results-table")).toBeNull();

    mockUseMediaQuery.mockReturnValue(false);
    unmount();
    render(<App />);
    expect(document.querySelector(".results-table")).toBeInTheDocument();
  });
});
