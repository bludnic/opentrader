#!/bin/bash

# Determine the script's directory
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Path to the file containing the admin password
PASSWORD_FILE="${HOME}/.opentrader/pass"

# Extract the password from the file
if [ -f "$PASSWORD_FILE" ]; then
  ADMIN_PASSWORD=$(cat "$PASSWORD_FILE")
  echo "Admin password: **********"
else
  echo "Password file not found!"
  exit 1
fi

# Run the Node.js script with the resolved directory
ADMIN_PASSWORD=$ADMIN_PASSWORD DATABASE_URL="file:${HOME}/.opentrader/dev.db" node "$SCRIPT_DIR/../dist/main.mjs" "$@"
