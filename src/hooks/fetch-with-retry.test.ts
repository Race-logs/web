import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchWithRetry } from "./fetch-with-retry";

describe("fetchWithRetry", () => {
  const url = "https://api.test";
  const searchString = "kipchoge";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("succeeds at first attempt with maxRetries = 2", async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({ id: 1, firstName: "Eliud", lastName: "Kipchoge" }),
    };
    const mockFetch = vi.fn().mockResolvedValue(mockResponse);
    global.fetch = mockFetch as any;

    const result = await fetchWithRetry<typeof mockResponse>(
      url,
      searchString,
      2,
      10,
    );

    expect(result).toEqual({ id: 1, firstName: "Eliud", lastName: "Kipchoge" });
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("succeeds at second attempt with maxRetries = 2", async () => {
    const firstError = new Error("Network error");
    const mockResponse = {
      ok: true,
      json: async () => ({
        id: 2,
        firstName: "Haile",
        lastName: "Gebrselassie",
      }),
    };
    const mockFetch = vi
      .fn()
      .mockRejectedValueOnce(firstError)
      .mockResolvedValueOnce(mockResponse);
    global.fetch = mockFetch as any;

    const result = await fetchWithRetry<typeof mockResponse>(
      url,
      searchString,
      2,
      10,
    );

    expect(result).toEqual({
      id: 2,
      firstName: "Haile",
      lastName: "Gebrselassie",
    });
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it("fails after two retries with maxRetries = 2", async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error("Permanent failure"));
    global.fetch = mockFetch as any;

    await expect(fetchWithRetry(url, searchString, 2, 5)).rejects.toThrow(
      "Permanent failure",
    );
    expect(mockFetch).toHaveBeenCalledTimes(3);
  });

  it("retries when fetch resolves with non-OK status", async () => {
    const badResponse = { ok: false, status: 500, json: async () => ({}) };
    const mockFetch = vi.fn().mockResolvedValue(badResponse);
    global.fetch = mockFetch as any;

    await expect(fetchWithRetry(url, searchString, 1, 5)).rejects.toThrow(
      "HTTP 500",
    );
    expect(mockFetch).toHaveBeenCalledTimes(2); // first + 1 retry
  });

  it("escapes and appends searchString to URL", async () => {
    const mockResponse = { ok: true, json: async () => null };
    const mockFetch = vi.fn().mockResolvedValue(mockResponse);
    global.fetch = mockFetch as any;

    await fetchWithRetry(url, "Haile & Bekele", 0, 5);

    expect(mockFetch).toHaveBeenCalledTimes(1);

    const calledArgs = mockFetch.mock.calls[0];
    expect(calledArgs).toBeDefined();

    const calledUrl = new URL(calledArgs![0]);
    expect(calledUrl.searchParams.get("searchString")).toBe("Haile & Bekele");
  });
});
