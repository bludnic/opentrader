/**
 * GET /api/v5/public/instruments
 * @see https://www.okx.com/docs-v5/en/#rest-api-public-data-get-instruments
 */
export interface IOKXGetInstrumentInfo {
  /**
   * Instrument type.
   */
  instType: string;
  instId: string;
  uly: string;
  instFamily: string;
  category: string;
  baseCcy: string;
  quoteCcy: string;
  settleCcy: string;
  ctVal: string;
  ctMult: string;
  ctValCcy: string;
  optType: string;
  stk: string;
  listTime: string;
  expTime: string;
  lever: string;
  tickSz: string;
  lotSz: string;
  minSz: string;
  ctType: string;
  alias: string;
  state: string;
  maxLmtSz: string;
  maxMktSz: string;
  maxTwapSz: string;
  maxIcebergSz: string;
  maxTriggerSz: string;
  maxStopSz: string;
}
