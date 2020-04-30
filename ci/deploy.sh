#!/bin/bash
set -e

export COMPOSE_FILE=docker-compose.yml

cd bechdel-demo

docker-compose down
git fetch
git checkout $DEPLOYMENT_SHA
docker-compose pull
docker-compose up -d --no-build
