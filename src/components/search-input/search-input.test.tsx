import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { SearchInput } from "./search-input";

describe("SearchInput", () => {
  const handleChange = vi.fn();
  const handleSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the provided placeholder text", () => {
    render(
      <SearchInput
        value=""
        onChange={handleChange}
        onSubmit={handleSubmit}
        placeholder="Search runner..."
      />,
    );

    const input = screen.getByPlaceholderText("Search runner...");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "search");
  });

  it("calls onChange with the new value when user types", () => {
    render(
      <SearchInput
        value=""
        onChange={handleChange}
        onSubmit={handleSubmit}
        placeholder="Search..."
      />,
    );

    const input = screen.getByPlaceholderText("Search...");

    fireEvent.change(input, { target: { value: "Haile Gebrselassie" } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith("Haile Gebrselassie");
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("calls onSubmit when Enter is pressed with non-empty input", () => {
    render(
      <SearchInput
        value="Kipchoge"
        onChange={handleChange}
        onSubmit={handleSubmit}
        placeholder="Search..."
      />,
    );

    const input = screen.getByPlaceholderText("Search...");

    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it("does not call onSubmit when any key other than Enter is pressed", () => {
    render(
      <SearchInput
        value="Bekele"
        onChange={handleChange}
        onSubmit={handleSubmit}
        placeholder="Search..."
      />,
    );

    const input = screen.getByPlaceholderText("Search...");

    fireEvent.keyDown(input, { key: "a", code: "KeyA" });
    fireEvent.keyDown(input, { key: " ", code: "Space" });
    fireEvent.keyDown(input, { key: "Escape", code: "Escape" });

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("does not call onSubmit when Enter is pressed and input is empty", () => {
    render(
      <SearchInput
        value=""
        onChange={handleChange}
        onSubmit={handleSubmit}
        placeholder="Search..."
      />,
    );

    const input = screen.getByPlaceholderText("Search...");

    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    expect(handleSubmit).not.toHaveBeenCalled();
  });
});
