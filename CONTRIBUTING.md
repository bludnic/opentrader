# Requirements

```bash
# NodeJS v20 or higher
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

2. Update the `ADMIN_PASSWORD`. The password is required to authorize later in the Opentrader UI.

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

**Option 1**: Run both `frontend` and `processor` apps in a single terminal

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

# Project structure

- Strategies dir: [packages/bot-templates](/packages/bot-templates/src/templates)
- Indicators: [packages/indicators](/packages/indicators/src/indicators)
- Exchange connectors: [packages/exchanges](/packages/exchanges/src/exchanges)
