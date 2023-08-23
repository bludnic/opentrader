const { ExchangeCode } = require("@bifrost/types");
const { resolve } = require("path");
const fs = require("fs");
const { exchanges } = require("../dist");

const exchange = exchanges[ExchangeCode.OKX]();

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchCandlesticks(since) {
  const candlesticks = await exchange.getCandlesticks({
    symbol: "UNI/USDT",
    bar: "1m",
    since,
    limit: 100,
  });
  console.log(
    `since ${since} ${new Date(since).toISOString()}`,
    candlesticks.length
  );
  await delay(100);
  if (candlesticks.length > 0) {
    const lastCandle = candlesticks[candlesticks.length - 1];
    const newSince = lastCandle.timestamp + 60000 // +1 min

    return [...candlesticks, ...await fetchCandlesticks(newSince)];
  }

  return candlesticks;
}

async function writeToFile(candlesticks) {
  const json = JSON.stringify(candlesticks, undefined, 2);

  fs.writeFileSync(resolve("./result.json"), json);
}

async function run() {
  const candlesticks = await fetchCandlesticks(
    new Date("2023-08-01").getTime()
  );

  await writeToFile(candlesticks);
}

run();
