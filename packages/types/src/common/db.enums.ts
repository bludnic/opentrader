export const XBotType = {
  Bot: "Bot",
  GridBot: "GridBot",
} as const;
export type XBotType = (typeof XBotType)[keyof typeof XBotType];

export const XOrderSide = {
  Buy: "Buy",
  Sell: "Sell",
} as const;
export type XOrderSide = (typeof XOrderSide)[keyof typeof XOrderSide];

export const XOrderStatus = {
  Idle: "Idle",
  Placed: "Placed",
  Filled: "Filled",
  Canceled: "Canceled",
  Revoked: "Revoked",
  Deleted: "Deleted",
} as const;
export type XOrderStatus = (typeof XOrderStatus)[keyof typeof XOrderStatus];

export const XOrderType = {
  Limit: "Limit",
  Market: "Market",
} as const;
export type XOrderType = (typeof XOrderType)[keyof typeof XOrderType];

export const XUserRole = {
  User: "User",
  Admin: "Admin",
} as const;
export type XUserRole = (typeof XUserRole)[keyof typeof XUserRole];

export const XSmartTradeType = {
  Trade: "Trade",
  DCA: "DCA",
} as const;

export type XSmartTradeType = (typeof XSmartTradeType)[keyof typeof XSmartTradeType];

export const XEntryType = {
  Order: "Order",
  Ladder: "Ladder",
} as const;
export type XEntryType = (typeof XEntryType)[keyof typeof XEntryType];

export const XTakeProfitType = {
  Order: "Order",
  Ladder: "Ladder",
  None: "None",
} as const;
export type XTakeProfitType = (typeof XTakeProfitType)[keyof typeof XTakeProfitType];

export const XEntityType = {
  EntryOrder: "EntryOrder",
  TakeProfitOrder: "TakeProfitOrder",
  StopLossOrder: "StopLossOrder",
  SafetyOrder: "SafetyOrder",
} as const;
export type XEntityType = (typeof XEntityType)[keyof typeof XEntityType];
