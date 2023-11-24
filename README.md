# Requirements

```bash
# NodeJS v18 or higher
$ node -v

# `pnpm` must be installed
$ pnpm -v

# Install Turborepo globally
$ pnpm install turbo --global

# Docker (optional)
$ docker -v
```

## Environment variables

The project uses a single `.env` file located in the root directory.
Frameworks like Next.js requires `.env` file to be located in the project dir itself.
To solve this some apps/packages may contain a symlink to the root `.env`.

1. Create environment file `.env` in the root directory

```bash
$ cp .env.example .env
```

2. Replace the `DATABASE_URL` if your URL is different from the actual one.

> 💡 **Tip**: You can run PostgreSQL inside a Docker container with `docker compose up -d postgres-db`. See details below.

# Docker (optional)

1. If you want to use PostgreSQL within a Docker container use the following commands:

```bash
$ docker compose up -d database # start service
$ docker compose stop database # stop service
```

2. Or, if you are using WebStorm, just open `docker-compose.yml` and click ▶️ near the service name.

# Processing app (optional)

The `apps/processor` is a separate NodeJS app that synchronizes orders with the Exchange faster by using WebSockets.

Features:

- Sync orders statuses with the Exchange by using WebSockets
- Fallback to REST API by polling every 60s
- Runs the bot template if any order was filled
- Place pending orders on the Exchange
- Async queue (in case two or more orders were filled at the same time)

The package is optional. If you decide to use it, don't forget to disable the sync orders statuses in the `frontend` app.
Otherwise, it may end up in an inconsistent bot state when two synchronizers running at the same time.
For development it's enough to run the `frontend` app.

# Installation

1. Install dependencies

```bash
$ pnpm install
```

2. Build `/packages/**`

```bash
$ turbo run build --filter='./packages/*'
```

3. Run db migrations

```bash
$ turbo run prisma:migrate
```

4. Seed the database

```bash
$ turbo run prisma:seed
```

> ⚠️ **Note**: Due to that fact that packages doesn't have a `dev` server itself, the `build` command is mandatory on first run.
>
> If you made changes inside a package, don't forget to run `build` command again.

# Development

**Option 1**: Runs both `frontend` and `processor` apps in a single terminal

```bash
$ turbo run dev
```

**Option 2**: Run each app in a separate terminal

First Terminal

```bash
$ cd apps/frontend
$ pnpm run dev
```

Second Terminal

```bash
$ cd apps/processor
$ pnpm run dev
```

# Apps

- Frontend: http://localhost:3000
- Processor: http://localhost:4000
