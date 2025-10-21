import { useEffect, useState } from "react";
import { fetchWithRetry } from "./fetch-with-retry";

const MAX_RETRIES = 3;
const DELAY_MS = 1000;

type InitialState = {
  data: null;
  loading: false;
  error: false;
};

type LoadingState = {
  data: null;
  loading: true;
  error: false;
};

type ErrorState = {
  data: null;
  loading: false;
  error: true;
};

type SuccessState<T> = {
  data: T;
  loading: false;
  error: false;
};

export type UseFetchResultType<T> =
  | InitialState
  | LoadingState
  | ErrorState
  | SuccessState<T>;

export const useFetchData = <T>(
  url: string,
  searchString: string,
): UseFetchResultType<T> => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!searchString) return;

    let mounted = true;
    setLoading(true);
    setError(false);

    fetchWithRetry<T>(url, searchString, MAX_RETRIES, DELAY_MS)
      .then((d) => {
        if (mounted) setData(d);
      })
      .catch(() => {
        if (mounted) setError(true);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [url, searchString]);

  if (loading) {
    return { data: null, loading: true, error: false };
  }
  if (error) {
    return { data: null, loading: false, error: true };
  }
  if (data) {
    return { data: data, loading: false, error: false };
  }
  return { data: null, loading: false, error: false };
};
