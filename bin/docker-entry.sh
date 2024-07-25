#!/bin/sh

# This is the entry point for Docker container
# to run the DB migrations before starting the app

# Run database migrations
/app/node_modules/prisma/build/index.js migrate deploy --schema /app/packages/prisma/src/schema.prisma

# Run the seed script
node /app/packages/prisma/seed.mjs

# Start the application
exec "$@"
