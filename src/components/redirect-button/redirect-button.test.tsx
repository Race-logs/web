import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { RedirectButton } from "./redirect-button";

describe("RedirectButton", () => {
  it("renders a styled button with the arrow icon", () => {
    render(<RedirectButton onClick={() => {}} />);

    const button = screen.getByRole("button");

    expect(button).toHaveClass("redirect-button");
    expect(button).toHaveAttribute("type", "button");
    expect(button.querySelector("svg")).not.toBeNull();
    expect(button.querySelector("svg")?.getAttribute("aria-hidden")).toBe(
      "true",
    );
  });

  it("calls onClick when pressed", () => {
    const handleClick = vi.fn();

    render(<RedirectButton onClick={handleClick} />);

    fireEvent.click(screen.getByRole("button"));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
