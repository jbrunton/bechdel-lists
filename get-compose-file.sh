#!/bin/bash
set -e

if [[ $1 == 'development' ]]; then
  echo ""
elif [[ $1 == 'production' ]]; then
  echo "docker-compose.yml"
elif [[ $1 == 'cypress' ]]; then
  echo "docker-compose.yml:docker-compose.override.yml:docker-compose.cypress.yml"
elif [[ $1 == 'cy-open' ]]; then
  echo "docker-compose.yml:docker-compose.override.yml:docker-compose.cypress.yml:docker-compose.cy-open.yml"
elif [[ $1 == '' ]]; then
  echo "Usage: ./set-compose-file.sh <mode>"
  echo "  Modes: development | production | cypress | cy-open"
  exit 1
else
  echo "Invalid argument. Valid modes: development | production | cypress | cy-open"
  exit 1
fi
