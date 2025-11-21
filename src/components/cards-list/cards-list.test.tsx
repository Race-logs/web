import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CardsList } from "./cards-list";

describe("CardsList", () => {
  it("renders sections, actions, and items", () => {
    const sections = [
      {
        id: "section-1",
        title: "First Section",
        action: (
          <button type="button" aria-label="section-action">
            ↗
          </button>
        ),
        items: ["A", "B"],
        renderItem: (item: string) => <p>{item}</p>,
        getItemKey: (item: string) => item,
      },
    ];

    render(<CardsList sections={sections} />);

    const heading = screen.getByRole("heading", { name: "First Section" });
    expect(heading).toBeInTheDocument();
    const section = heading.closest("section");
    if (!section) throw new Error("section not found");
    expect(section).toHaveAttribute("aria-labelledby", heading.id);
    expect(screen.getByLabelText("section-action")).toBeInTheDocument();
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
  });

  it("omits sections that have no items", () => {
    const sections = [
      {
        id: "empty",
        title: "Empty Section",
        items: [],
        renderItem: (item: string) => <p>{item}</p>,
        getItemKey: (item: string) => item,
      },
      {
        id: "non-empty",
        title: "Non Empty",
        items: ["Only item"],
        renderItem: (item: string) => <p>{item}</p>,
        getItemKey: (item: string) => item,
      },
    ];

    render(<CardsList sections={sections} />);

    expect(
      screen.queryByRole("heading", { name: "Empty Section" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Non Empty" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Only item")).toBeInTheDocument();
  });

  it("returns null when there are no sections", () => {
    const { container } = render(<CardsList sections={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
