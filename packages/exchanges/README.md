# @opentrader/exchanges

## Usage

### Server

```tsx
import { ExchangeCode } from "@opentrader/types";
import { exchanges, cache } from "@opentrader/exchanges";
import { PrismaCacheProvider } from '@opentrader/exchanges/server'

cache.setCacheProvider(new PrismaCacheProvider());

export default async function Page() {
  const exchange = exchanges[ExchangeCode.OKX]();
  const markets = await exchange.loadMarkets(); // cached in Prisma

  return <div>{Object.keys(markets).length}</div>;
}
```

### Client

```tsx
"use client";

import { ExchangeCode } from "@opentrader/types";
import { exchanges, cache } from "@opentrader/exchanges";
import { MemoryCacheProvider } from "@opentrader/exchanges/client";

cache.setCacheProvider(new MemoryCacheProvider()); // can be ommited (used by default)

export default async function Page() {
  const exchange = exchanges[ExchangeCode.OKX]();
  const markets = await exchange.loadMarkets(); // cached in Memory

  return <div>{Object.keys(markets).length}</div>;
}
```
