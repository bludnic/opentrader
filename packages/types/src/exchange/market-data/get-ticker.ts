export type ITicker = {
  symbol: string;
  timestamp: number;

  bid: number;
  ask: number;
  last: number;

  open?: number;
  high?: number;
  low?: number;
  close?: number;

  baseVolume: number;
  quoteVolume: number;
};
