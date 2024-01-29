const routes = {
  dashboard: "/dashboard",
  accounts: "/dashboard/accounts",
  "bot/:id": (botId: number) => {
    if (process.env.NEXT_PUBLIC_STATIC === "true") {
      return `/dashboard/bot/info?id=${botId}`;
    }

    return `/dashboard/bot/${botId}`;
  },
  "grid-bot": "/dashboard/grid-bot",
  "grid-bot/:id": (botId: number) => {
    if (process.env.NEXT_PUBLIC_STATIC === "true") {
      return `/dashboard/grid-bot/info?id=${botId}`;
    }

    return `/dashboard/grid-bot/${botId}`;
  },
  "grid-bot/create": "/dashboard/grid-bot/create",
} as const;

type Routes = typeof routes;
type RouteKey = keyof Routes;

type RouteParams<R extends RouteKey> = Routes[R] extends (
  ...args: infer P
) => string
  ? P
  : [];

export function toPage<R extends RouteKey>(
  route: R,
  ...args: RouteParams<R>
): string {
  const path = routes[route];

  if (typeof path === "string") {
    return path;
  }

  // eslint-disable-next-line prefer-spread -- ok
  return path.apply(null, args as any);
}
