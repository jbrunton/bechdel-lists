#!/bin/bash
set -e

docker-compose up -d
docker-compose run api npm run db:test:create
docker-compose run api npm run test:integration
          