import { useCallback, useEffect, useState } from "react";

const QUERY_PARAM = "q";

const readQueryFromLocation = () => {
  if (typeof window === "undefined") return "";

  const params = new URLSearchParams(window.location.search);
  return params.get(QUERY_PARAM) ?? "";
};

export const useSearchQuerySync = () => {
  const [searchQuery, setSearchQuery] = useState<string>(() =>
    readQueryFromLocation(),
  );

  const handlePopState = useCallback(() => {
    setSearchQuery(readQueryFromLocation());
  }, []);

  useEffect(() => {
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [handlePopState]);

  const writeSearchQuery = useCallback((value: string) => {
    if (typeof window === "undefined") return;

    const current = readQueryFromLocation();
    if (current === value) {
      setSearchQuery(value);
      return;
    }

    const url = new URL(window.location.href);
    if (value) {
      url.searchParams.set(QUERY_PARAM, value);
    } else {
      url.searchParams.delete(QUERY_PARAM);
    }

    window.history.pushState({}, "", url);
    setSearchQuery(value);
  }, []);

  return { searchQuery, writeSearchQuery };
};
