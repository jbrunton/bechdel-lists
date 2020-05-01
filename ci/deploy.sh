#!/bin/bash
set -e

COMPOSE_FILE=docker-compose.deployment.yml
mv $DEPLOYMENT_FILE $COMPOSE_FILE

docker-compose pull

export POSTGRES_CONNECTION
docker-compose up --detach --no-build --remove-orphans
