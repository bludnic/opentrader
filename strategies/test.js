function* strategy(ctx) {
  console.log('Test strategy executed!', ctx.market.candle)
}

module.exports = strategy
