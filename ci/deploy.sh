#!/bin/bash
set -e

cd bechdel-demo

COMPOSE_FILE=docker-compose.yml
docker-compose down
git fetch
git checkout $DEPLOYMENT_SHA
docker-compose pull
docker-compose up -d --no-build
