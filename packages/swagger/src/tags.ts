const tags = [
  {
    name: "grid-bot",
    description: "Grid Bot",
  },
  {
    name: "exchange-account",
    description: "Exchange Accounts",
  },
  {
    name: "backtesting",
    description: "Backtesting",
  },
  {
    name: "marketplace",
    description: "Marketplace",
  },
  {
    name: "smart-trading",
    description: "Smart Trading",
  },
  {
    name: "trade-bot",
    description: "Trade Bot",
  },
  {
    name: "candlesticks-history",
    description: "Candlesticks history",
  },
  {
    name: "symbol",
    description: "Symbols",
  },
] as const;

export type Tags = typeof tags;
export type Tag = Tags[number];

export const SwaggerTags = {
  getTags() {
    return tags;
  },
  getTag(tagName: Tag["name"]) {
    return <Tag>tags.find((tag) => {
      return tag.name === tagName;
    });
  },
  getName(tagName: Tag["name"]) {
    return this.getTag(tagName).name;
  },
};
