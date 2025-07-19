#!/bin/bash
set -e
cd server && npm install
cd ../client && npm install
echo "Setup complete."
chmod +x scripts/setup.sh