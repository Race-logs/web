import { useEffect, useState } from "react";
import { fetchWithRetry } from "./fetch-with-retry";

const MAX_RETRIES = 3;
const DELAY_MS = 1000;

type InitialState<T> = {
  data: T;
  loading: false;
  error: false;
};

type LoadingState<T> = {
  data: T;
  loading: true;
  error: false;
};

type ErrorState<T> = {
  data: T;
  loading: false;
  error: true;
};

type SuccessState<T> = {
  data: T;
  loading: false;
  error: false;
};

export type UseFetchResultType<T> =
  | InitialState<T>
  | LoadingState<T>
  | ErrorState<T>
  | SuccessState<T>;

export const useFetchData = <T>(
  url: string,
  searchString: string,
  initialData: T,
): UseFetchResultType<T> => {
  const [currentData, setCurrentData] = useState<T>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (!searchString) {
      setLoading(false);
      setError(false);
      return;
    }

    let mounted = true;
    setLoading(true);
    setError(false);

    fetchWithRetry<T>(url, searchString, MAX_RETRIES, DELAY_MS)
      .then((d) => {
        if (mounted) {
          setCurrentData(d);
          setHasFetched(true);
        }
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

  if (!hasFetched && !loading && !error) {
    return { data: currentData, loading: false, error: false };
  }
  if (loading) {
    return { data: currentData, loading: true, error: false };
  }
  if (error) {
    return { data: currentData, loading: false, error: true };
  }
  return { data: currentData, loading: false, error: false };
};
