import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { SearchButton } from "./search-button";

describe("SearchButton", () => {
  const handleClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders a disabled button when status='disabled'", () => {
    render(<SearchButton onClick={handleClick} status="disabled" />);

    const button = screen.getByRole("button", { name: "Cerca" });

    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();

    fireEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it("renders a loading button and it is disabled", () => {
    render(<SearchButton onClick={handleClick} status="loading" />);

    const button = screen.getByRole("button", { name: "Cerca" });

    expect(button).toHaveClass("search-button__loading");
    expect(button).toBeDisabled();

    fireEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it("renders a ready button and calls onClick when clicked", () => {
    render(<SearchButton onClick={handleClick} status="ready" />);

    const button = screen.getByRole("button", { name: "Cerca" });

    expect(button).toHaveClass("search-button__ready");
    expect(button).not.toBeDisabled();

    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders a retry button labeled 'Riprova' and calls onClick", () => {
    render(<SearchButton onClick={handleClick} status="retry" />);

    const button = screen.getByRole("button", { name: "Riprova" });

    expect(button).toHaveClass("search-button__retry");
    expect(button).not.toBeDisabled();

    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
