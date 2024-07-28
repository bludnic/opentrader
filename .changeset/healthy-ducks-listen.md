---
"opentrader": patch
"frontend": patch
"processor": patch
---

- fix(watchers, ccxt): hande `ExchangeClosedByUser` error
- feat(processor): stop running bots on SIGINT (#49)
- feat(processor): clean orphaned bots on process start (#49)
