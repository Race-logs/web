import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { AthleteRaceResult } from "../../entities/athlete-race-result";
import { ResultsCards } from "./results-cards";

const baseResult: AthleteRaceResult = {
  id: "result-0",
  race: {
    id: "race-0",
    name: "Base Race",
    date: new Date("2024-09-01T00:00:00"),
    location: "Milan",
  },
  athlete: {
    id: "athlete-0",
    firstName: "Luca",
    lastName: "Bianchi",
    gender: "M",
    yearOfBirth: 1992,
  },
  category: "SM",
  bibNumber: 101,
  sportsClub: "Sky Alp Club",
  position: 1,
  timeSeconds: 3600,
  gapSeconds: 0,
  paceMinKm: 4,
};

const getRequiredElement = <T extends Element>(
  element: T | null,
  label: string,
): T => {
  if (!element) {
    throw new Error(`Expected ${label} to exist`);
  }

  return element;
};

describe("ResultsCards", () => {
  const handleRedirect = vi.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null when there are no race results", () => {
    const { container } = render(
      <ResultsCards results={[]} onRedirect={handleRedirect} />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("groups results by race and renders the athlete info inside cards", async () => {
    const results: AthleteRaceResult[] = [
      {
        ...baseResult,
        id: "result-1",
        race: { ...baseResult.race, id: "race-1", name: "Valmalenco Vertical" },
        athlete: { ...baseResult.athlete, id: "athlete-1", lastName: "Rossi" },
        position: 1,
        bibNumber: 11,
        timeSeconds: 4200,
      },
      {
        ...baseResult,
        id: "result-2",
        race: { ...baseResult.race, id: "race-1", name: "Valmalenco Vertical" },
        athlete: { ...baseResult.athlete, id: "athlete-2", lastName: "Verdi" },
        position: 2,
        bibNumber: 12,
        gapSeconds: 90,
      },
      {
        ...baseResult,
        id: "result-3",
        race: { ...baseResult.race, id: "race-2", name: "Tre Cime Trail" },
        athlete: { ...baseResult.athlete, id: "athlete-3", lastName: "Neri" },
        position: 1,
        bibNumber: 21,
      },
    ];

    const { container } = render(
      <ResultsCards results={results} onRedirect={handleRedirect} />,
    );

    expect(
      screen.getByRole("heading", { name: "Valmalenco Vertical" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Tre Cime Trail" }),
    ).toBeInTheDocument();

    expect(screen.getByText("Rossi Luca")).toBeInTheDocument();
    expect(screen.getByText("Verdi Luca")).toBeInTheDocument();
    expect(screen.getByText("Neri Luca")).toBeInTheDocument();
    const firstCard = getRequiredElement(
      container.querySelector(".results-card") as HTMLElement | null,
      "results card",
    );
    expect(within(firstCard).getByText("#1")).toBeInTheDocument();
    expect(within(firstCard).getByText("N° 11")).toBeInTheDocument();

    const toggleButton = within(firstCard).getByLabelText("Mostra dettagli");
    await user.click(toggleButton);

    expect(
      within(firstCard).getByText("Categoria", { exact: false }),
    ).toBeInTheDocument();
  });

  it("redirects to race and athlete details when the corresponding buttons are clicked", async () => {
    const result: AthleteRaceResult = {
      ...baseResult,
      race: { ...baseResult.race, id: "race-click", name: "Lario Trail" },
      athlete: {
        ...baseResult.athlete,
        id: "athlete-click",
        lastName: "Ferri",
      },
    };

    render(<ResultsCards results={[result]} onRedirect={handleRedirect} />);

    const raceHeading = screen.getByRole("heading", { name: "Lario Trail" });
    const raceSection = getRequiredElement(
      raceHeading.closest(".cards-list__section") as HTMLElement | null,
      "race section",
    );
    const raceHeader = getRequiredElement(
      raceSection.querySelector(
        ".cards-list__section-header",
      ) as HTMLElement | null,
      "race header",
    );
    const raceButton = within(raceHeader).getByRole("button", {
      name: "Vai ai dettagli della gara Lario Trail",
    });
    await user.click(raceButton);

    const athleteName = screen.getByText("Ferri Luca");
    const athleteSection = getRequiredElement(
      athleteName.closest(".results-card__athlete") as HTMLElement | null,
      "athlete section",
    );
    const athleteButton = within(athleteSection).getByRole("button");
    await user.click(athleteButton);

    expect(handleRedirect).toHaveBeenNthCalledWith(1, "race id is race-click");
    expect(handleRedirect).toHaveBeenNthCalledWith(
      2,
      "athlete id is athlete-click",
    );
  });
});
