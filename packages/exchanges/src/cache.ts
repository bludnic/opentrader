import type { ICacheProvider } from "./types/cache/cache-provider.interface.js";
import { MemoryCacheProvider } from "./client/cache/providers/memory-cache.provider.js";

type Cache = {
  cacheProvider: ICacheProvider;
  getCacheProvider: () => ICacheProvider;
  setCacheProvider: (cacheProvider: ICacheProvider) => void;
};

export const cache: Cache = {
  cacheProvider: new MemoryCacheProvider(),
  getCacheProvider() {
    return this.cacheProvider;
  },
  setCacheProvider(cacheProvider) {
    this.cacheProvider = cacheProvider;
  },
};
