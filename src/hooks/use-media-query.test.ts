import { renderHook, act } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useMediaQuery } from "./use-media-query";

const originalMatchMedia = window.matchMedia;

const defineMatchMedia = (value: typeof window.matchMedia | undefined) => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value,
  });
};

type Listener = (event: MediaQueryListEvent) => void;

const toListener = (listener: EventListenerOrEventListenerObject): Listener => {
  if (typeof listener === "function") {
    return listener as Listener;
  }

  return listener.handleEvent.bind(listener) as Listener;
};

const setupMatchMediaMock = (initialMatches = false) => {
  const listeners = new Set<Listener>();
  let latestQuery = "(max-width: 0px)";
  let currentMatches = initialMatches;

  const mockMatchMedia = vi
    .fn<(query: string) => MediaQueryList>()
    .mockImplementation((query: string) => {
      latestQuery = query;
      const mediaQueryList = {
        matches: currentMatches,
        media: query,
        onchange: null,
        addListener: (listener: Listener) => {
          listeners.add(listener);
        },
        removeListener: (listener: Listener) => {
          listeners.delete(listener);
        },
        addEventListener: (
          _event: "change",
          listener: EventListenerOrEventListenerObject,
        ) => {
          listeners.add(toListener(listener));
        },
        removeEventListener: (
          _event: "change",
          listener: EventListenerOrEventListenerObject,
        ) => {
          listeners.delete(toListener(listener));
        },
        dispatchEvent: () => true,
      } satisfies MediaQueryList;
      return mediaQueryList;
    });

  defineMatchMedia(mockMatchMedia);

  const triggerChange = (matches: boolean) => {
    currentMatches = matches;
    const event = { matches, media: latestQuery } as MediaQueryListEvent;
    listeners.forEach((listener) => {
      listener(event);
    });
  };

  return { mockMatchMedia, triggerChange };
};

afterEach(() => {
  defineMatchMedia(originalMatchMedia);
  vi.restoreAllMocks();
});

describe("useMediaQuery", () => {
  it("returns the initial match status provided by matchMedia", () => {
    const { mockMatchMedia } = setupMatchMediaMock(true);

    const { result } = renderHook(() => useMediaQuery("(max-width: 600px)"));

    expect(mockMatchMedia).toHaveBeenCalledWith("(max-width: 600px)");
    expect(result.current).toBe(true);
  });

  it("updates when the media query match status changes", () => {
    const { triggerChange } = setupMatchMediaMock(false);

    const { result } = renderHook(() => useMediaQuery("(max-width: 600px)"));

    expect(result.current).toBe(false);

    act(() => {
      triggerChange(true);
    });

    expect(result.current).toBe(true);
  });

  it("falls back to false when matchMedia is not available", () => {
    defineMatchMedia(undefined);

    const { result } = renderHook(() => useMediaQuery("(max-width: 600px)"));

    expect(result.current).toBe(false);
  });
});
