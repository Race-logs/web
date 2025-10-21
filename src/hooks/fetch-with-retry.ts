export const fetchWithRetry = async <T>(
  url: string,
  searchString: string,
  maxRetries: number,
  delayMs: number,
): Promise<T> => {
  const fullUrl = new URL(url);
  fullUrl.searchParams.set("searchString", searchString);

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(fullUrl.toString(), {
        method: "POST",
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return (await res.json()) as T;
    } catch (err) {
      if (attempt === maxRetries) throw err;
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }

  throw new Error("Unexpected");
};
