// Next.js `fetch()` for CCXT (#57)
type FetchParams = Parameters<typeof fetch>;

export const fetcher = (input: FetchParams[0], init?: FetchParams[1]) =>
  fetch(input, {
    ...init,
    cache: "no-cache",
  });
