import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { SearchBar } from "./search-bar";

describe("SearchBar", () => {
  const user = userEvent.setup();

  const handleSearch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls onSearch with trimmed value when clicking the button", async () => {
    render(<SearchBar onSearch={handleSearch} loading={false} error={false} />);

    const input = screen.getByPlaceholderText(/cerca/i);

    await user.type(input, "  Vanoni  ");

    await waitFor(() =>
      expect(screen.getByRole("button", { name: /cerca/i })).not.toBeDisabled(),
    );

    await user.click(screen.getByRole("button", { name: /cerca/i }));

    expect(handleSearch).toHaveBeenCalledTimes(1);
    expect(handleSearch).toHaveBeenCalledWith("Vanoni");
  });

  it("does not call onSearch when the button is disabled", async () => {
    render(<SearchBar onSearch={handleSearch} loading={false} error={false} />);

    const button = screen.getByRole("button", { name: /cerca/i });
    expect(button).toBeDisabled();

    await user.click(button);

    expect(handleSearch).not.toHaveBeenCalled();
  });

  it("does not call onSearch when loading is true", async () => {
    render(<SearchBar onSearch={handleSearch} loading={true} error={false} />);

    const input = screen.getByPlaceholderText(/cerca/i);
    const button = screen.getByRole("button", { name: /cerca/i });

    await user.type(input, "Valtellina");
    await user.click(button);

    expect(handleSearch).not.toHaveBeenCalled();
    expect(button).toBeDisabled();
  });

  it("shows a retry button labeled 'Riprova' and calls onSearch when clicked", async () => {
    render(<SearchBar onSearch={handleSearch} loading={false} error={true} />);

    const input = screen.getByPlaceholderText(/cerca/i);

    await user.type(input, "  Trail del Bosco  ");

    const button = screen.getByRole("button", { name: "Riprova" });
    expect(button).not.toBeDisabled();

    await user.click(button);

    expect(handleSearch).toHaveBeenCalledTimes(1);
    expect(handleSearch).toHaveBeenCalledWith("Trail del Bosco");
  });

  it("disables the button again when the input is cleared", async () => {
    render(<SearchBar onSearch={handleSearch} loading={false} error={false} />);

    const input = screen.getByPlaceholderText(/cerca/i);

    await user.type(input, "Trail");
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /cerca/i })).not.toBeDisabled(),
    );

    await user.clear(input);
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /cerca/i })).toBeDisabled(),
    );

    const button = screen.getByRole("button", { name: /cerca/i });
    await user.click(button);

    expect(handleSearch).not.toHaveBeenCalled();
  });

  it("calls onSearch with trimmed value when pressing Enter in the input", async () => {
    render(<SearchBar onSearch={handleSearch} loading={false} error={false} />);

    const input = screen.getByPlaceholderText(/cerca/i);

    await user.type(input, "   Valgerola   {enter}");

    expect(handleSearch).toHaveBeenCalledTimes(1);
    expect(handleSearch).toHaveBeenCalledWith("Valgerola");
  });

  it("does not call onSearch when input contains only whitespace", async () => {
    render(<SearchBar onSearch={handleSearch} loading={false} error={false} />);

    const input = screen.getByPlaceholderText(/cerca/i);
    await user.type(input, "      ");
    const button = screen.getByRole("button", { name: /cerca/i });

    await user.click(button);

    expect(handleSearch).not.toHaveBeenCalled();
    expect(button).toBeDisabled();
  });
});
