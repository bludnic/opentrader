# @opentrader/processor

Node for processing orders on the Exchange.

This package is optional. You can still use the app with CRON jobs to sync the orders.

## Features

- Syncing Exchange orders with DB
- Placing pending DB orders on the Exchange
- Executing bot template when order was filled
- Supports WebSockets subscription on orders status change
- Fallback to REST API if WS connection interrupted
