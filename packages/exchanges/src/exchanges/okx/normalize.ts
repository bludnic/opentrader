import { ExchangeCode } from "@bifrost/types";
import { Normalize } from "src/types/normalize.interface";
import { normalizeOrderStatus } from "../../utils/normalizeOrderStatus";
import { composeSymbolIdFromPair } from "@bifrost/tools";

const accountAssets: Normalize["accountAssets"] = {
  response: (data) =>
    Object.entries(data).map(([currency, balance]) => {
      return {
        currency,
        balance: Number(balance.total),
        availableBalance: Number(balance.free),
      };
    }),
};

const getLimitOrder: Normalize["getLimitOrder"] = {
  request: (params) => [params.orderId, params.symbol],
  response: (order) => ({
    exchangeOrderId: order.id,
    clientOrderId: order.clientOrderId,
    side: order.side,
    quantity: order.amount,
    price: order.price,
    filledPrice: order.average || null,
    status: normalizeOrderStatus(order),
    fee: order.fee.cost,
    createdAt: order.timestamp,
  }),
};

const placeLimitOrder: Normalize["placeLimitOrder"] = {
  request: (params) => [
    params.symbol,
    params.side,
    params.quantity,
    params.price,
  ],
  response: (order) => ({
    orderId: order.id,
    clientOrderId: order.clientOrderId,
  }),
};

const cancelLimitOrder: Normalize["cancelLimitOrder"] = {
  request: (params) => [params.orderId, params.symbol],
  response: (data) => ({
    orderId: data.id,
  }),
};

const getFilledLimitOrders: Normalize["getFilledLimitOrders"] = {
  request: (params) => [params.symbol],
  response: (orders) =>
    orders.map((order) => ({
      exchangeOrderId: order.id,
      clientOrderId: order.clientOrderId,
      side: order.side,
      quantity: order.amount,
      price: order.price,
      filledPrice: order.average || order.price, // assume that filled order must always contain `order.average`
      status: "filled",
      fee: order.fee.cost,
      createdAt: order.timestamp,
    })),
};

const getMarketPrice: Normalize["getMarketPrice"] = {
  request: (params) => [params.symbol],
  response: (ticker) => ({
    symbol: ticker.symbol,
    price: ticker.last || ticker.bid || ticker.ask,
    timestamp: ticker.timestamp,
  }),
};

const getCandlesticks: Normalize["getCandlesticks"] = {
  request: (params) => [params.symbol, params.bar, params.since, params.limit],
  response: (candlesticks) =>
    candlesticks.map((candlestick) => ({
      timestamp: candlestick[0],
      open: candlestick[1],
      high: candlestick[2],
      low: candlestick[3],
      close: candlestick[4],
    })),
};

const getSymbol: Normalize["getSymbol"] = {
  request: (params) => [params.currencyPair],
  response: (market) => ({
    symbolId: composeSymbolIdFromPair(ExchangeCode.OKX, market.symbol),
    currencyPair: market.symbol,
    exchangeCode: ExchangeCode.OKX,
    exchangeSymbolId: market.id,

    baseCurrency: market.base,
    quoteCurrency: market.quote,

    filters: {
      price: {
        tickSize: market.info.tickSz,
        minPrice: null, // OKx doesn't provide this info
        maxPrice: null, // OKx doesn't provide this info
      },
      lot: {
        stepSize: market.info.lotSz,
        minQuantity: market.info.minSz,
        maxQuantity: market.info.maxLmtSz,
      },
    },
  }),
};

const getSymbols: Normalize["getSymbols"] = {
  response: (markets) =>
    Object.entries(markets).map(([symbol, market]) =>
      getSymbol.response(market),
    ),
};

export const normalize: Normalize = {
  accountAssets,
  getLimitOrder,
  placeLimitOrder,
  cancelLimitOrder,
  getFilledLimitOrders,
  getMarketPrice,
  getCandlesticks,
  getSymbol,
  getSymbols,
};
