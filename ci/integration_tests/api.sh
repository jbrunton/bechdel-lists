#!/bin/bash
set -e

docker-compose up -d
docker-compose run api bin/rails db:test:prepare
docker-compose run api bin/rails spec:integration
