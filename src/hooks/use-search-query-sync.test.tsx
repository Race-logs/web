import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useSearchQuerySync } from "./use-search-query-sync";

type SearchQuerySyncResult = {
  searchQuery: string;
  writeSearchQuery: (value: string) => void;
};

const TestComponent = () => {
  const { searchQuery, writeSearchQuery } = useSearchQuerySync();

  return (
    <div>
      <span data-testid="search-query">{searchQuery}</span>
      <button type="button" onClick={() => writeSearchQuery("next-query")}>
        set-query
      </button>
      <button type="button" onClick={() => writeSearchQuery("")}>
        clear-query
      </button>
    </div>
  );
};

describe("useSearchQuerySync", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/");
  });

  it("initializes with the query param from the URL", () => {
    window.history.pushState({}, "", "/?q=preloaded");

    render(<TestComponent />);

    expect(screen.getByTestId("search-query").textContent).toBe("preloaded");
  });

  it("writes the search query to the URL when requested", async () => {
    const user = userEvent.setup();
    render(<TestComponent />);

    await user.click(screen.getByText("set-query"));

    expect(screen.getByTestId("search-query").textContent).toBe("next-query");
    expect(window.location.search).toBe("?q=next-query");

    await user.click(screen.getByText("clear-query"));
    expect(window.location.search).toBe("");
  });

  it("updates when the user navigates back/forward (popstate)", () => {
    render(<TestComponent />);

    window.history.pushState({}, "", "/?q=other");
    fireEvent(window, new PopStateEvent("popstate"));

    expect(screen.getByTestId("search-query").textContent).toBe("other");
  });

  it("does not push history when writing the same query value", () => {
    window.history.pushState({}, "", "/?q=repeat");

    const pushStateSpy = vi.spyOn(window.history, "pushState");
    const { result } = renderHook(() => useSearchQuerySync());

    act(() => result.current.writeSearchQuery("repeat"));

    try {
      expect(result.current.searchQuery).toBe("repeat");
      expect(pushStateSpy).not.toHaveBeenCalled();
    } finally {
      pushStateSpy.mockRestore();
    }
  });

  it("returns empty query and no-ops when window is unavailable", () => {
    const originalWindow = globalThis.window;
    vi.stubGlobal("window", undefined as unknown as Window & typeof globalThis);

    let hookResult: SearchQuerySyncResult | undefined;

    const ServerComponent = () => {
      hookResult = useSearchQuerySync();
      return null;
    };

    renderToString(<ServerComponent />);

    try {
      if (!hookResult) throw new Error("Hook result not initialized");

      expect(hookResult.searchQuery).toBe("");
      hookResult.writeSearchQuery("ignored");
      expect(hookResult.searchQuery).toBe("");
    } finally {
      vi.unstubAllGlobals();
      globalThis.window = originalWindow;
    }
  });
});
