import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useFetchData } from "./use-fetch-data";
import { fetchWithRetry } from "./fetch-with-retry";

vi.mock("./fetch-with-retry", () => ({
  fetchWithRetry: vi.fn(),
}));

type MockResult = Array<{ id: number; label: string }>;

const API_URL = "https://api.test";

describe("useFetchData", () => {
  beforeEach(() => {
    vi.mocked(fetchWithRetry).mockReset();
  });

  const renderUseFetchData = (query: string, initialData: MockResult) =>
    renderHook(({ search, seed }) => useFetchData(API_URL, search, seed), {
      initialProps: { search: query, seed: initialData },
    });

  it("returns the initial data when no search has started", () => {
    const seed: MockResult = [{ id: 1, label: "Seed" }];
    const { result } = renderUseFetchData("", seed);

    expect(result.current).toEqual({
      data: seed,
      loading: false,
      error: false,
    });
    expect(fetchWithRetry).not.toHaveBeenCalled();
  });

  it("transitions through loading and success, replacing the data", async () => {
    const seed: MockResult = [{ id: 1, label: "Seed" }];
    const fetched: MockResult = [{ id: 2, label: "Fetched" }];
    const mockFetch = vi.mocked(fetchWithRetry);
    mockFetch.mockResolvedValueOnce(fetched);

    const { result, rerender } = renderUseFetchData("", seed);

    rerender({ search: "query", seed });

    await waitFor(() => {
      expect(result.current).toEqual({
        data: seed,
        loading: true,
        error: false,
      });
    });

    await waitFor(() => {
      expect(result.current).toEqual({
        data: fetched,
        loading: false,
        error: false,
      });
    });
  });

  it("keeps the last successful data when the next request fails", async () => {
    const seed: MockResult = [{ id: 1, label: "Seed" }];
    const fetched: MockResult = [{ id: 2, label: "Fetched" }];
    const mockFetch = vi.mocked(fetchWithRetry);
    mockFetch
      .mockResolvedValueOnce(fetched)
      .mockRejectedValueOnce(new Error("boom"));

    const { result, rerender } = renderUseFetchData("first", seed);

    await waitFor(() => {
      expect(result.current).toEqual({
        data: fetched,
        loading: false,
        error: false,
      });
    });

    rerender({ search: "second", seed });

    await waitFor(() => {
      expect(result.current).toEqual({
        data: fetched,
        loading: false,
        error: true,
      });
    });
  });

  it("retains the last data while a new request is in flight", async () => {
    const seed: MockResult = [{ id: 1, label: "Seed" }];
    const first: MockResult = [{ id: 2, label: "First" }];
    const second: MockResult = [{ id: 3, label: "Second" }];
    const mockFetch = vi.mocked(fetchWithRetry);
    let resolveSecond: (value: MockResult) => void = () => {};

    mockFetch.mockResolvedValueOnce(first).mockReturnValueOnce(
      new Promise<MockResult>((resolve) => {
        resolveSecond = resolve;
      }),
    );

    const { result, rerender } = renderUseFetchData("first", seed);

    await waitFor(() => {
      expect(result.current).toEqual({
        data: first,
        loading: false,
        error: false,
      });
    });

    rerender({ search: "second", seed });

    await waitFor(() => {
      expect(result.current).toEqual({
        data: first,
        loading: true,
        error: false,
      });
    });

    resolveSecond(second);

    await waitFor(() => {
      expect(result.current).toEqual({
        data: second,
        loading: false,
        error: false,
      });
    });
  });

  it("ignores stale responses from previous searches", async () => {
    const seed: MockResult = [{ id: 1, label: "Seed" }];
    const stale: MockResult = [{ id: 2, label: "Stale" }];
    const fresh: MockResult = [{ id: 3, label: "Fresh" }];
    const mockFetch = vi.mocked(fetchWithRetry);
    let resolveStale: (value: MockResult) => void = () => {};
    let resolveFresh: (value: MockResult) => void = () => {};

    mockFetch
      .mockReturnValueOnce(
        new Promise<MockResult>((resolve) => {
          resolveStale = resolve;
        }),
      )
      .mockReturnValueOnce(
        new Promise<MockResult>((resolve) => {
          resolveFresh = resolve;
        }),
      );

    const { result, rerender } = renderUseFetchData("", seed);

    rerender({ search: "first", seed });

    await waitFor(() => {
      expect(result.current).toEqual({
        data: seed,
        loading: true,
        error: false,
      });
    });

    rerender({ search: "second", seed });

    await waitFor(() => {
      expect(result.current).toEqual({
        data: seed,
        loading: true,
        error: false,
      });
    });

    resolveFresh(fresh);

    await waitFor(() => {
      expect(result.current).toEqual({
        data: fresh,
        loading: false,
        error: false,
      });
    });

    resolveStale(stale);

    await waitFor(() => {
      expect(result.current).toEqual({
        data: fresh,
        loading: false,
        error: false,
      });
    });

    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it("ignores late successes after unmount", async () => {
    const seed: MockResult = [{ id: 1, label: "Seed" }];
    const pending: MockResult = [{ id: 2, label: "Pending" }];
    const mockFetch = vi.mocked(fetchWithRetry);
    let resolvePending: (value: MockResult) => void = () => {};

    mockFetch.mockReturnValue(
      new Promise<MockResult>((resolve) => {
        resolvePending = resolve;
      }),
    );

    const { result, rerender, unmount } = renderUseFetchData("", seed);

    rerender({ search: "go", seed });

    await waitFor(() => {
      expect(result.current).toEqual({
        data: seed,
        loading: true,
        error: false,
      });
    });

    unmount();
    resolvePending(pending);

    await Promise.resolve();

    expect(mockFetch).toHaveBeenCalledWith(API_URL, "go", 3, 1000);
  });

  it("ignores late errors after unmount", async () => {
    const seed: MockResult = [{ id: 1, label: "Seed" }];
    const mockFetch = vi.mocked(fetchWithRetry);
    let rejectPending: (reason?: unknown) => void = () => {};

    mockFetch.mockReturnValue(
      new Promise((_, reject) => {
        rejectPending = reject;
      }),
    );

    const { result, rerender, unmount } = renderUseFetchData("", seed);

    rerender({ search: "go", seed });

    await waitFor(() => {
      expect(result.current).toEqual({
        data: seed,
        loading: true,
        error: false,
      });
    });

    unmount();
    rejectPending(new Error("network"));

    await Promise.resolve();

    expect(mockFetch).toHaveBeenCalledWith(API_URL, "go", 3, 1000);
  });
});
