import { toExchangeSymbol } from "#exchanges/exchanges/okx/utils";
import { ExchangeCode } from "@opentrader/types";
import { composeSymbolIdFromPair } from "@opentrader/tools";
import type { Normalize } from "#exchanges/types/normalize.interface";
import { normalizeOrderStatus } from "#exchanges/utils/normalizeOrderStatus";

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
    lastTradeTimestamp: order.lastTradeTimestamp,
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

const placeStopOrder: Normalize["placeStopOrder"] = {
  request: (params) => {
    const type = params.type === "limit" ? "limit" : "market";

    return [
      params.symbol,
      type,
      params.side,
      params.quantity,
      type === "limit" ? params.price : undefined,
      params.stopPrice,
    ];
  },
  response: (order) => ({
    orderId: order.id,
    clientOrderId: order.clientOrderId,
  }),
};

const placeStopLimitOrder: Normalize["placeStopLimitOrder"] = {
  request: (params) => ({
    instId: toExchangeSymbol(params.symbol),
    side: params.side,
    ordType: "conditional",
    sz: String(params.quantity),
    tdMode: "cash",
    tgtCcy: "base_ccy",
    tpTriggerPx: String(params.stopPrice),
    tpOrdPx: String(params.price),
  }),
  response: (res) => ({
    orderId: res.data[0].algoId,
  }),
};

const placeStopMarketOrder: Normalize["placeStopMarketOrder"] = {
  request: (params) => ({
    instId: toExchangeSymbol(params.symbol),
    side: params.side,
    ordType: "conditional",
    sz: String(params.quantity),
    tdMode: "cash",
    // When size="sell" and tgtCcy="base_ccy"
    // the OKX API return an error "Parameter tgtCcy error"
    // even the order will use actually "base_ccy"
    tgtCcy: params.side === "buy" ? "base_ccy" : undefined,
    tpTriggerPx: String(params.stopPrice),
    tpOrdPx: "-1",
  }),
  response: (res) => ({
    orderId: res.data[0].algoId,
  }),
};

const placeOCOOrder: Normalize["placeOCOOrder"] = {
  request: (params) => ({
    instId: toExchangeSymbol(params.symbol),
    side: params.side,
    ordType: "oco",
    sz: String(params.quantity),
    tdMode: "cash",
    // When size="sell" and tgtCcy="base_ccy"
    // the OKX API return an error "Parameter tgtCcy error"
    // even the order will use actually "base_ccy"
    tgtCcy: params.side === "buy" ? "base_ccy" : undefined,
    tpTriggerPx: String(params.tpStopPrice),
    tpOrdPx: params.tpType === "limit" ? String(params.tpPrice) : "-1",
    slTriggerPx: String(params.slStopPrice),
    slOrdPx: params.slType === "limit" ? String(params.slPrice) : "-1",
  }),
  response: (res) => ({
    orderId: res.data[0].algoId,
  }),
};

const cancelLimitOrder: Normalize["cancelLimitOrder"] = {
  request: (params) => [params.orderId, params.symbol],
  response: (data) => ({
    orderId: data.id,
  }),
};

const getOpenOrders: Normalize["getOpenOrders"] = {
  request: (params) => [params.symbol],
  response: (orders) =>
    orders.map((order) => ({
      exchangeOrderId: order.id,
      clientOrderId: order.clientOrderId,
      side: order.side,
      quantity: order.amount,
      price: order.price,
      filledPrice: null,
      status: normalizeOrderStatus(order),
      fee: order.fee.cost,
      createdAt: order.timestamp,
      lastTradeTimestamp: order.lastTradeTimestamp,
    })),
};

const getClosedOrders: Normalize["getClosedOrders"] = {
  request: (params) => [params.symbol],
  response: (orders) =>
    orders.map((order) => ({
      exchangeOrderId: order.id,
      clientOrderId: order.clientOrderId,
      side: order.side,
      quantity: order.amount,
      price: order.price,
      filledPrice: order.average || order.price, // assume that filled order must always contain `order.average`
      status: normalizeOrderStatus(order),
      fee: order.fee.cost,
      createdAt: order.timestamp,
      lastTradeTimestamp: order.lastTradeTimestamp,
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
        /* eslint-disable @typescript-eslint/no-unsafe-member-access -- @todo need to assert */
        tickSize: market.info.tickSz,
        minPrice: null, // OKx doesn't provide this info
        maxPrice: null, // OKx doesn't provide this info
      },
      lot: {
        stepSize: market.info.lotSz,
        minQuantity: market.info.minSz,
        maxQuantity: market.info.maxLmtSz,
        /* eslint-enable @typescript-eslint/no-unsafe-member-access -- @todo need to assert */
      },
    },
  }),
};

const getSymbols: Normalize["getSymbols"] = {
  response: (markets) =>
    Object.entries(markets).map(([_symbol, market]) =>
      getSymbol.response(market),
    ),
};

const watchOrders: Normalize["watchOrders"] = {
  request: (params) => [params.symbol],
  response: (orders) =>
    orders.map((order) => ({
      exchangeOrderId: order.id,
      clientOrderId: order.clientOrderId,
      side: order.side,
      quantity: order.amount,
      price: order.price,
      filledPrice: order.average || null,
      status: normalizeOrderStatus(order),
      fee: order.fee.cost,
      createdAt: order.timestamp,
      lastTradeTimestamp: order.lastTradeTimestamp,
    })),
};

export const normalize: Normalize = {
  accountAssets,
  getLimitOrder,
  placeLimitOrder,
  placeStopOrder,
  placeStopLimitOrder,
  placeStopMarketOrder,
  placeOCOOrder,
  cancelLimitOrder,
  getOpenOrders,
  getClosedOrders,
  getMarketPrice,
  getCandlesticks,
  getSymbol,
  getSymbols,
  watchOrders,
};
