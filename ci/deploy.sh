#!/bin/bash
set -e

export COMPOSE_FILE=docker-compose.deployment.yml
cp $DEPLOYMENT_FILE $COMPOSE_FILE

docker-compose pull

export POSTGRES_CONNECTION
docker-compose up --detach --no-build --remove-orphans
