# Requirements

```bash
# NodeJS v20 or higher
node -v

# `pnpm` must be installed
pnpm -v

# `moonrepo` must be installed
moon --version

# Docker (optional)
docker -v
```

## Setup

1. Clone the repository:

```bash
git clone git@github.com:bludnic/opentrader.git
```

2. Clone Git submodules (optional). Run this only if you have access to the [opentrader-pro](https://github.com/bludnic/opentrader-pro) repository (private). Refer to the [UI](/CONTRIBUTING.md#UI) section below.

```bash
git submodule update --init
```

## Environment variables

The project uses a single `.env` file located in the root directory. Some packages may contain a symlink to the root `.env`.

1. Create environment file `.env` in the root directory

```bash
cp .env.example .env
```

2. Update the `ADMIN_PASSWORD` if you are going to expose the app externally.

# Installation

1. Install dependencies

```bash
pnpm install
```

2. Run database migrations

```bash
moon run prisma:migrate
```

3. Seed the database

```bash
moon run prisma:seed
```

4. Build the project

```bash
moon run :build
```

# Development

## CLI

You can interact with the bot by using CLI.
If you made changes in the code, don't forget to rebuild the project `moon run :build`.

```bash
# List of commands
./bin/cli.sh --help

# Start the daemon
./bin/cli.sh up

# Running Grid bot strategy
./bin/cli.sh trade grid

# Running RSI strategy
./bin/cli.sh trade rsi
```

> [!NOTE]
> See the [CLI](/README.md#cli) section in the README.md on how to connect an exchange and configure the strategy params.

## UI

The UI allows managing multiple bots and strategies, viewing backtest results, and monitoring live trading.

> [!IMPORTANT]
> Currently, the UI resides in a private repo until I decide on the licensing and funding model,
> so this option is not available to the public yet.

**Option 1**: Run both `frontend` and `backend` apps in a single terminal

```bash
moon run :dev
```

**Option 2**: Run each app in a separate terminal

First Terminal

```bash
moon run frontend:dev
```

Second Terminal

```bash
moon run backend:dev
```

# Apps

- Frontend: http://localhost:3000
- Backend: http://localhost:4000
- CLI: http://localhost:8000

# Project structure

- Strategies dir: [packages/bot-templates](/packages/bot-templates/src/templates)
- Indicators: [packages/indicators](/packages/indicators/src/indicators)
- Exchange connectors: [packages/exchanges](/packages/exchanges/src/exchanges)
