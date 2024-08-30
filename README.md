<p align="center">
  <a href="https://github.com/bludnic/opentrader" title="OpenTrader">
    <img src=".github/images/logo.png" alt="OpenTrader logo" width="128" />
  </a>
</p>

[![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/bludnic/opentrader/dev.yml)](https://github.com/bludnic/opentrader/actions)
[![GitHub commit activity](https://img.shields.io/github/commit-activity/m/bludnic/opentrader)](https://github.com/bludnic/opentrader/graphs/contributors)
[![Static Badge](https://img.shields.io/badge/Community-white?logo=Telegram)](https://t.me/+cJLNxLSjcW83Njgy)

[OpenTrader](https://github.com/bludnic/opentrader) is an advanced cryptocurrency trading bot offering high-frequency, cross-exchange arbitrage and event-based strategies, including technical analysis with indicators. Features a user-friendly management UI, robust backtesting capabilities, and support for 100+ exchanges via CCXT.

**Strategies:**

- [x] [Grid](packages/bot-templates/src/templates/grid-bot.ts): A grid trading strategy that profits from the price fluctuation of an asset.
- [x] [RSI](packages/bot-templates/src/templates/rsi.ts): A Relative Strength Index (RSI) strategy that buys and sells based on the RSI indicator.
- [ ] `DCA`: Dollar-Cost Averaging (DCA) strategy that buys an asset at regular intervals.
- [ ] `ARB`: Arbitrage strategy that takes advantage of price differences through cross-exchange trading.

# 🤖 State of the Project

This project is a personal passion, developed in my free time, and currently not monetized. If you find it useful, please give it a ⭐️. Your support means a lot and motivates me to keep improving the bot. If you'd like to make a donation, see the options below. 💖

> [!NOTE]
If you choose to build the project from source, please note that you'll only be able to interact with the bot via the CLI, and you can run only one bot instance. Running multiple bots requires the UI, which currently resides in a private repo until I finalize the licensing and funding options.

Currently, the NPM version includes the full bot functionality, including the UI, and I'm offering it for free to early adopters. 🎉

# Quick start

Get started with OpenTrader in just a few steps. Follow this quick guide to install, configure, and run your crypto trading bot.

## Installation

1. Install OpenTrader globally using npm:

```bash
npm install -g opentrader
```

2. Set an admin password for later accessing the OpenTrader UI:

```bash
opentrader set-password <password>
```

2. Start the OpenTrader app

```bash
opentrader up
```

The app will start the RPC server and listen on port 8000.

> **Tip**: Use `opentrader up -d` to start the app as a daemon. To stop it, run `opentrader down`.

# Usage

## UI

The user interface allows managing multiple bots and strategies, viewing backtest results, and monitoring live trading.

![UI Preview](.github/images/ui.png)

You can access the OpenTrader UI on: http://localhost:8000

## CLI

### Connect an exchange

Copy the `exchanges.sample.json5` file to `exchanges.json5` and add your API keys.

> Available exchanges: OKX, BYBIT, BINANCE, KRAKEN, COINBASE, GATEIO

### Choose a strategy

Create the strategy configuration file `config.json5`. We will use the `grid` strategy as an example.

```json5
{
  // Grid strategy params
  settings: {
    highPrice: 70000, // upper price of the grid
    lowPrice: 60000, // lower price of the grid
    gridLevels: 20, // number of grid levels
    quantityPerGrid: 0.0001, // quantity in base currency per each grid
  },
  pair: "BTC/USDT",
  exchange: "DEFAULT",
}
```

> Currently supported strategies: `grid`, `rsi`

### Run a backtest

Command: `opentrader backtest <strategy> --from <date> --to <date> -t <timeframe>`

Example running a `grid` strategy on `1h` timeframe.

```bash
opentrader backtest grid --from 2024-03-01 --to 2024-06-01 -t 1h
```

> To get more accurate results, use a smaller timeframe, e.g. 1m, however, it will take more time to download OHLC data from the exchange.

### Running a Live Trading

Command: `opentrader trade <strategy>`

Example running a live trading with `grid` strategy.

```bash
opentrader trade grid
```

> To stop the live trading, run `opentrader stop`

# Project structure

- Strategies dir: [packages/bot-templates](/packages/bot-templates/src/templates)
- Indicators: [packages/indicators](/packages/indicators/src/indicators)
- Exchange connectors: [packages/exchanges](/packages/exchanges/src/exchanges)

# 🪪 License

Licensed under the [Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0) License. See the [LICENSE](LICENSE) file for more information.

# Disclaimer

This software is for educational purposes only. USE THE SOFTWARE AT YOUR OWN RISK. THE AUTHORS AND ALL AFFILIATES ASSUME NO RESPONSIBILITY FOR YOUR TRADING RESULTS. Do not risk money that you are afraid to lose. There might be bugs in the code - this software DOES NOT come with ANY warranty.

# Donate

If you find OpenTrader useful and would like to support its development, consider making a donation. Your contributions will help cover the costs of maintaining and improving this project.

**Donate via:**

- **Bitcoin (BTC):** `1LBqWWne1ac455UmUDVF32ozVAhy1HgVXn`
- **Ethereum (ETH):** `0x60371d49F9Cc7ec7d7e34979D5DD31996B7B43Ff`

Thank you for your support!
