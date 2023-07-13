export type IOKXCancelLimitOrderRequestBody =
  | {
      /**
       * Instrument ID.
       *
       * e.g. ADA-USDT
       */
      instId: string;
      /**
       * Order ID.
       *
       * Either ordId or clOrdId is required. If both are passed, ordId will be used.
       */
      ordId?: string;
      /**
       * Client-supplied order ID.
       */
      clOrdId: string;
    }
  | {
      /**
       * Instrument ID.
       *
       * e.g. ADA-USDT
       */
      instId: string;
      /**
       * Order ID.
       *
       * Either ordId or clOrdId is required. If both are passed, ordId will be used.
       */
      ordId: string;
      /**
       * Client-supplied order ID.
       */
      clOrdId?: string;
    };
