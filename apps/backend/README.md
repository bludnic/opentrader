## Description

The backend

## Installation

```bash
$ pnpm install
$ pnpm run bootstrap
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## tRPC

The `type AppRouter` is generated in a separate bundle by `pnpm run trpc:generate`.
The output can be found in `./dist-trpc` dir.
Later it can be imported in other packages like this:

```ts
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@opentrader/backend";
//     👆 **type-only** import

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `http://localhost:4000/trpc`,
    }),
  ],
});
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

