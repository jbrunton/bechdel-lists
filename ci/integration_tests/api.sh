#!/bin/bash
set -e

docker-compose up -d --no-build
docker-compose run api npm run db:test:create
docker-compose run api npm run test:integration
          