import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useFetchData } from "./use-fetch-data";
import { fetchWithRetry } from "./fetch-with-retry";

vi.mock("./fetch-with-retry", () => ({
  fetchWithRetry: vi.fn(),
}));

describe("useFetchData", () => {
  it("handles the full workflow: initial -> loading -> success", async () => {
    const mockData = [{ id: 1, firstName: "Eliud", lastName: "Kipchoge" }];
    const mockFetch = vi.mocked(fetchWithRetry);
    mockFetch.mockResolvedValueOnce(mockData);

    const { result, rerender } = renderHook(
      ({ query }) => useFetchData<typeof mockData>("https://api.test", query),
      { initialProps: { query: "" } },
    );

    // Initial state
    expect(result.current).toEqual({
      data: null,
      loading: false,
      error: false,
    });

    // Trigger fetch by setting query
    rerender({ query: "test" });

    // After rerender, loading state should appear
    await waitFor(() => {
      expect(result.current).toEqual({
        data: null,
        loading: true,
        error: false,
      });
    });

    // Wait until success
    await waitFor(() => {
      expect(result.current).toEqual({
        data: mockData,
        loading: false,
        error: false,
      });
    });
  });

  it("handles the full workflow: initial -> loading -> error", async () => {
    const mockData = [{ id: 1, firstName: "Eliud", lastName: "Kipchoge" }];
    const mockFetch = vi.mocked(fetchWithRetry);
    mockFetch.mockRejectedValueOnce(new Error("Generic error"));

    const { result, rerender } = renderHook(
      ({ query }) => useFetchData<typeof mockData>("https://api.test", query),
      { initialProps: { query: "" } },
    );

    // Initial state
    expect(result.current).toEqual({
      data: null,
      loading: false,
      error: false,
    });

    // Trigger fetch by setting query
    rerender({ query: "test" });

    // After rerender, loading state should appear
    await waitFor(() => {
      expect(result.current).toEqual({
        data: null,
        loading: true,
        error: false,
      });
    });

    // Wait until success
    await waitFor(() => {
      expect(result.current).toEqual({
        data: null,
        loading: false,
        error: true,
      });
    });
  });
});
