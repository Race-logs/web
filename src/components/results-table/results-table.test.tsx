import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { AthleteRaceResult } from "../../entities/athlete-race-result";
import { formatTime } from "./format-time";
import { ResultsTable } from "./results-table";

const baseResult: AthleteRaceResult = {
  id: "result-0",
  race: {
    id: "race-0",
    name: "Base Race",
    date: new Date("01/01/2025"),
    location: "Milan",
  },
  athlete: {
    id: "athlete-0",
    firstName: "Mario",
    lastName: "Rossi",
    gender: "M",
    yearOfBirth: 1990,
  },
  category: "SM",
  bibNumber: 1,
  sportsClub: "Team Rocket",
  position: 1,
  timeSeconds: 3600,
  gapSeconds: 0,
  paceMinKm: 4,
};

const getRequiredElement = <T extends Element>(
  element: T | null | undefined,
  label: string,
): T => {
  if (!element) {
    throw new Error(`Expected ${label} to exist`);
  }

  return element;
};

const getCells = (row: HTMLElement) =>
  within(row).getAllByRole("cell") as HTMLElement[];

const getCellAt = (
  cells: HTMLElement[],
  index: number,
  label: string,
): HTMLElement => {
  const cell = cells[index];
  return getRequiredElement(cell, label);
};

const getRowForText = (text: string, label?: string) => {
  const node = screen.getByText(text);
  return getRequiredElement(
    (node.closest("tr") as HTMLElement | null) ??
      (node.parentElement as HTMLElement | null),
    label ?? `row for ${text}`,
  );
};

describe("ResultsTable", () => {
  const handleRedirect = vi.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders a race header each time the race name changes", () => {
    const results: AthleteRaceResult[] = [
      {
        ...baseResult,
        id: "result-1",
        race: {
          ...baseResult.race,
          id: "race-1",
          name: "Valmalenco Vertical",
          date: new Date("2023-06-10T00:00:00"),
        },
        athlete: {
          ...baseResult.athlete,
          id: "athlete-1",
          lastName: "Bianchi",
          firstName: "Luisa",
        },
        position: 1,
        bibNumber: 11,
      },
      {
        ...baseResult,
        id: "result-2",
        race: {
          ...baseResult.race,
          id: "race-1",
          name: "Valmalenco Vertical",
          date: new Date("2023-06-10T00:00:00"),
        },
        athlete: {
          ...baseResult.athlete,
          id: "athlete-2",
          lastName: "Verdi",
          firstName: "Marco",
        },
        position: 2,
        bibNumber: 12,
      },
      {
        ...baseResult,
        id: "result-3",
        race: {
          ...baseResult.race,
          id: "race-2",
          name: "Tre Cime Trail",
          date: new Date("2023-07-22T00:00:00"),
        },
        athlete: {
          ...baseResult.athlete,
          id: "athlete-3",
          lastName: "Neri",
          firstName: "Giulia",
        },
        position: 1,
        bibNumber: 21,
      },
    ];

    const { container } = render(
      <ResultsTable results={results} onRedirect={handleRedirect} />,
    );

    const raceHeaders = container.querySelectorAll(".results-table__race-name");
    expect(raceHeaders).toHaveLength(2);
    expect(
      Array.from(raceHeaders).map((header) => header.textContent?.trim()),
    ).toEqual(["Valmalenco Vertical", "Tre Cime Trail"]);
  });

  it("does not repeat the race header for consecutive results in the same race", () => {
    const results: AthleteRaceResult[] = [
      {
        ...baseResult,
        id: "result-4",
        race: {
          ...baseResult.race,
          id: "race-3",
          name: "Pizzo dei Tre Signori",
          date: new Date("2023-08-15T00:00:00"),
        },
        athlete: {
          ...baseResult.athlete,
          id: "athlete-4",
          lastName: "Fumagalli",
          firstName: "Sara",
        },
        position: 1,
        bibNumber: 31,
      },
      {
        ...baseResult,
        id: "result-5",
        race: {
          ...baseResult.race,
          id: "race-3",
          name: "Pizzo dei Tre Signori",
          date: new Date("2023-08-15T00:00:00"),
        },
        athlete: {
          ...baseResult.athlete,
          id: "athlete-5",
          lastName: "Santi",
          firstName: "Luca",
        },
        position: 2,
        bibNumber: 32,
      },
    ];

    render(<ResultsTable results={results} onRedirect={handleRedirect} />);

    expect(
      screen.getAllByText("Pizzo dei Tre Signori", {
        selector: ".results-table__race-name",
      }),
    ).toHaveLength(1);
  });

  it("calls onRedirect with the race id when clicking the race header button", async () => {
    const results: AthleteRaceResult[] = [
      {
        ...baseResult,
        id: "result-6",
        race: {
          ...baseResult.race,
          id: "race-4",
          name: "Valtellina Skyrace",
          date: new Date("2023-09-02T00:00:00"),
        },
        athlete: {
          ...baseResult.athlete,
          id: "athlete-6",
          lastName: "Sala",
          firstName: "Chiara",
        },
        position: 1,
        bibNumber: 41,
      },
    ];

    render(<ResultsTable results={results} onRedirect={handleRedirect} />);

    const raceHeader = screen.getByText("Valtellina Skyrace");
    const raceHeaderContainer = getRequiredElement(
      raceHeader.closest(".results-table__race-name") as HTMLElement | null,
      "race header container",
    );
    const raceButton = within(raceHeaderContainer).getByRole("button", {
      name: "Vai ai dettagli della gara Valtellina Skyrace",
    });

    await user.click(raceButton);

    expect(handleRedirect).toHaveBeenCalledTimes(1);
    expect(handleRedirect).toHaveBeenCalledWith("race id is race-4");
  });

  it("calls onRedirect with the athlete id when clicking the athlete name button", async () => {
    const results: AthleteRaceResult[] = [
      {
        ...baseResult,
        id: "result-7",
        race: {
          ...baseResult.race,
          id: "race-5",
          name: "Valgoglio Trail",
          date: new Date("2023-09-18T00:00:00"),
        },
        athlete: {
          ...baseResult.athlete,
          id: "athlete-7",
          lastName: "Rusconi",
          firstName: "Paolo",
        },
        position: 3,
        bibNumber: 51,
        sportsClub: "Sky Team",
      },
    ];

    render(<ResultsTable results={results} onRedirect={handleRedirect} />);

    const athleteName = screen.getByText("Rusconi Paolo");
    const athleteContainer = getRequiredElement(
      (athleteName.closest(
        ".results-table__athlete-name",
      ) as HTMLElement | null) ??
        (athleteName.parentElement as HTMLElement | null),
      "athlete container",
    );
    const athleteButton = within(athleteContainer).getByRole("button", {
      name: "Vai ai dettagli di Rusconi Paolo",
    });

    await user.click(athleteButton);

    expect(handleRedirect).toHaveBeenCalledTimes(1);
    expect(handleRedirect).toHaveBeenCalledWith("athlete id is athlete-7");
  });

  it("renders athlete data inside the correct columns", () => {
    const result: AthleteRaceResult = {
      ...baseResult,
      id: "result-8",
      timeSeconds: 3661,
      gapSeconds: 12.5,
      paceMinKm: 4.3,
      race: {
        ...baseResult.race,
        id: "race-6",
        name: "Sky del Cielo",
        date: new Date("2023-10-01T00:00:00"),
      },
      athlete: {
        ...baseResult.athlete,
        id: "athlete-8",
        lastName: "Ruggeri",
        firstName: "Luca",
        yearOfBirth: 1988,
        gender: "F",
      },
      sportsClub: "Skyrunners Bergamo",
      position: 3,
      bibNumber: 101,
      category: "SM",
    };

    render(<ResultsTable results={[result]} onRedirect={handleRedirect} />);

    const athleteRow = getRowForText("Ruggeri Luca", "athlete row");
    const cells = getCells(athleteRow);

    const positionCell = getCellAt(cells, 0, "position cell");
    const bibCell = getCellAt(cells, 1, "bib cell");
    const athleteCell = getCellAt(cells, 2, "athlete cell");
    const timeCell = getCellAt(cells, 3, "time cell");
    const categoryCell = getCellAt(cells, 4, "category cell");
    const gapCell = getCellAt(cells, 5, "gap cell");
    const paceCell = getCellAt(cells, 6, "pace cell");

    expect(positionCell).toHaveTextContent("3");
    expect(bibCell).toHaveTextContent("101");
    expect(
      within(athleteCell).getByText("Skyrunners Bergamo"),
    ).toBeInTheDocument();
    expect(timeCell).toHaveTextContent(`1:01'01"`);
    expect(categoryCell).toHaveTextContent("SM-F");
    expect(categoryCell).toHaveTextContent("1988");
    expect(gapCell).toHaveTextContent(`0'12".500`);
    expect(paceCell).toHaveTextContent("4.3");
  });

  it("omits the hyphen between category and gender when category is empty", () => {
    const result: AthleteRaceResult = {
      ...baseResult,
      id: "result-9",
      race: {
        ...baseResult.race,
        id: "race-7",
        name: "Gran Canal Trail",
      },
      athlete: {
        ...baseResult.athlete,
        id: "athlete-9",
        lastName: "Bertolini",
        firstName: "Anna",
        gender: "F",
        yearOfBirth: 1995,
      },
      category: "",
    };

    render(<ResultsTable results={[result]} onRedirect={handleRedirect} />);

    const athleteRow = getRowForText("Bertolini Anna", "athlete row");
    const categoryCell = getCellAt(getCells(athleteRow), 4, "category cell");

    expect(categoryCell.textContent).toContain("F");
    expect(categoryCell.textContent).not.toContain("-F");
  });

  it("prefixes the gap with + when it is non-zero", () => {
    const result: AthleteRaceResult = {
      ...baseResult,
      id: "result-10",
      gapSeconds: 9.4,
      athlete: {
        ...baseResult.athlete,
        id: "athlete-10",
        lastName: "Longhi",
        firstName: "Andrea",
      },
    };

    render(<ResultsTable results={[result]} onRedirect={handleRedirect} />);

    const gapCell = getCellAt(
      getCells(getRowForText("Longhi Andrea")),
      5,
      "gap cell",
    );
    expect(gapCell).toHaveTextContent(`+${formatTime(9.4)}`);
  });

  it("shows no prefix when the gap is zero", () => {
    const result: AthleteRaceResult = {
      ...baseResult,
      id: "result-11",
      gapSeconds: 0,
      athlete: {
        ...baseResult.athlete,
        id: "athlete-11",
        lastName: "Marini",
        firstName: "Sofia",
      },
    };

    render(<ResultsTable results={[result]} onRedirect={handleRedirect} />);

    const gapCell = getCellAt(
      getCells(getRowForText("Marini Sofia")),
      5,
      "gap cell",
    );
    expect(gapCell).toHaveTextContent(formatTime(0));
    expect(gapCell).not.toHaveTextContent("+");
  });
});
