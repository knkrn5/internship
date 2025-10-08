#!/usr/bin/env bash

# Exit on error
set -o errexit

# Install everything, including devDependencies
npm install

# Then run build
npm run build
