import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import type { AthleteRaceResult } from "../../entities/athlete-race-result";
import { ResultCard } from "./result-card";

const baseResult: AthleteRaceResult = {
  id: "result-0",
  race: {
    id: "race-0",
    name: "Base Race",
    date: new Date("2024-09-01T00:00:00"),
    location: "milan",
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

describe("ResultCard", () => {
  const handleRedirect = vi.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders athlete data and toggles details", async () => {
    render(<ResultCard result={baseResult} onRedirect={handleRedirect} />);

    expect(screen.getByText("N° 101")).toBeInTheDocument();
    expect(screen.getByText("Bianchi Luca")).toBeInTheDocument();
    expect(screen.getByText("#1")).toBeInTheDocument();
    expect(screen.queryByText("Categoria")).not.toBeInTheDocument();

    const toggleButton = screen.getByLabelText("Mostra dettagli");
    await user.click(toggleButton);

    expect(screen.getByText("Categoria", { exact: false })).toBeInTheDocument();
  });

  it("ties the toggle button to the details container for accessibility", async () => {
    render(<ResultCard result={baseResult} onRedirect={handleRedirect} />);

    const detailsId = `${baseResult.id}-details`;
    const toggleButton = screen.getByRole("button", {
      name: "Mostra dettagli",
    });

    await user.click(toggleButton);

    expect(toggleButton).toHaveAttribute("aria-controls", detailsId);
    const details = document.getElementById(detailsId);
    if (!details) throw new Error("details list not found");
    expect(toggleButton).toHaveAttribute("aria-expanded", "true");
    expect(details).toBeInTheDocument();
  });

  it("redirects when clicking on the athlete button", async () => {
    render(<ResultCard result={baseResult} onRedirect={handleRedirect} />);

    const nameLine = screen.getByText("Bianchi Luca").closest("p");
    if (!nameLine) throw new Error("name line not found");
    const redirectButton = within(nameLine).getByRole("button", {
      name: "Vai ai dettagli di Bianchi Luca",
    });
    await user.click(redirectButton);

    expect(handleRedirect).toHaveBeenCalledWith("athlete id is athlete-0");
  });

  it("collapses details when the toggle is clicked twice", async () => {
    render(<ResultCard result={baseResult} onRedirect={handleRedirect} />);

    const toggleButton = screen.getByRole("button", {
      name: "Mostra dettagli",
    });

    await user.click(toggleButton);
    expect(toggleButton).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Categoria", { exact: false })).toBeInTheDocument();

    await user.click(toggleButton);
    expect(toggleButton).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Categoria")).not.toBeInTheDocument();
  });

  it("renders gap and category formatting correctly in details", async () => {
    const result: AthleteRaceResult = {
      ...baseResult,
      gapSeconds: 12.5,
      category: "",
      athlete: { ...baseResult.athlete, gender: "F" },
    };

    render(<ResultCard result={result} onRedirect={handleRedirect} />);

    const toggleButton = screen.getByRole("button", {
      name: "Mostra dettagli",
    });
    await user.click(toggleButton);

    const categoryRow = screen.getByText("Categoria").closest("div");
    if (!categoryRow) throw new Error("category row not found");
    expect(within(categoryRow).getByText("F")).toBeInTheDocument();
    expect(screen.getByText("+0'12\".500")).toBeInTheDocument();
  });
});
