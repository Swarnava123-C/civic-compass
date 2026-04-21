interface CacheEntry<T> {
  data: T;
  timestamp: number;
  maxAge: number;
}

const store = new Map<string, CacheEntry<unknown>>();

/**
 * Stale-while-revalidate cache for static civic content.
 * Returns cached data immediately; revalidates in background when stale.
 */
export function cachedGet<T>(
  key: string,
  fetcher: () => T | Promise<T>,
  maxAgeMs = 60_000
): T | Promise<T> {
  const entry = store.get(key) as CacheEntry<T> | undefined;
  const now = Date.now();

  if (entry) {
    const isStale = now - entry.timestamp > entry.maxAge;
    if (isStale) {
      // Revalidate in background
      Promise.resolve(fetcher()).then((freshData) => {
        store.set(key, { data: freshData, timestamp: Date.now(), maxAge: maxAgeMs });
      });
    }
    return entry.data; // Return stale data immediately
  }

  // No cache — fetch synchronously or async
  const result = fetcher();
  if (result instanceof Promise) {
    return result.then((data) => {
      store.set(key, { data, timestamp: Date.now(), maxAge: maxAgeMs });
      return data;
    });
  }
  store.set(key, { data: result, timestamp: Date.now(), maxAge: maxAgeMs });
  return result;
}

export function invalidateCache(key: string): void {
  store.delete(key);
}

export function clearCache(): void {
  store.clear();
}
