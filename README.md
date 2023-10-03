# Requirements

```bash
# NodeJS v18 required
$ node -v

# `pnpm` must be installed
$ pnpm -v

# Install Turborepo globally
$ pnpm install turbo --global

# Check Java is installed
$ java -version

# Docker should be installed
$ docker -v
```

# Configuration

## Backend configuration

Create environment file `.env.development.local`

```bash
$ cd apps/backend
$ cp .env.sample .env.development.local
```

## Frontend configuration

Create environment file `.env`

```bash
$ cd apps/frontend
$ cp .env.sample .env
```

## Database configuration

1. Create environment file `.env`.

```bash
$ cd packages/prisma
$ cp .env.example .env
```

2. Replace the `DATABASE_URL` if your URL is different from the actual one.

> 💡 **Tip**: You can run PostgreSQL inside a Docker container with `docker compose up -d postgres-db`. See details below.


# Docker (optional)

1. If you want to use PostgreSQL within a Docker container use the following commands:

```bash
$ docker compose up -d postgres-db # start service
$ docker compose -p opentrader stop postgres-db # stop service
```

2. Or, if you are using WebStorm, just open `docker-compose.yml` and click ▶️ near the service name.


# Installation

1. Install npm dependencies and run Prisma migrations.

```bash
$ pnpm install
```

2. Build `/apps` and local `/packages`

```bash
$ turbo run build
```


> ⚠️ **Note**: Due to that fact that packages doesn't have a `dev` server itself, the `build` command is mandatory on first run.
>
> If you made changes inside a package, don't forget to run `build` command again.


# Development

**Option 1**: Runs both `frontend` and `backend` apps in a single terminal

```bash
$ turbo run dev
```

**Option 2**: Run each app in a separate terminal

First Terminal

```bash
$ cd apps/backend
$ pnpm run dev
```

Second Terminal
```bash
$ cd apps/frontend
$ pnpm run dev
```

# Apps

- Frontend: http://localhost:3000
- Backend: http://localhost:4000
- Markets: http://localhost:5000
