import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { RedirectButton } from "./redirect-button";

describe("RedirectButton", () => {
  it("renders a styled button with the arrow icon", () => {
    render(<RedirectButton onClick={() => {}} label="Vai al dettaglio" />);

    const button = screen.getByRole("button", { name: "Vai al dettaglio" });

    expect(button).toHaveClass("redirect-button");
    expect(button).toHaveAttribute("type", "button");
    expect(button.querySelector("svg")).not.toBeNull();
    expect(button.querySelector("svg")?.getAttribute("aria-hidden")).toBe(
      "true",
    );
  });

  it("calls onClick when pressed", () => {
    const handleClick = vi.fn();

    render(<RedirectButton onClick={handleClick} label="Apri risorsa" />);

    fireEvent.click(screen.getByRole("button", { name: "Apri risorsa" }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
