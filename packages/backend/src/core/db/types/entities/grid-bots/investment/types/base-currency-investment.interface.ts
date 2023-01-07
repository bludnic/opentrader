export interface IBaseCurrencyInvestment {
  quantity: number;
  // usually is market price when starting the bot,
  // but can be customized if the user bought baseCurrency
  // earlier at different price
  price: number;
}
