#!/bin/bash

# Determine the script's directory
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Run the Node.js script with the resolved directory
node "$SCRIPT_DIR/../dist/main.mjs" "$@"