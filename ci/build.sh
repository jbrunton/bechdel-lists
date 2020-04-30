#!/bin/bash
set -e

export SHA=$(git rev-parse HEAD)

echo "$DOCKER_ACCESS_TOKEN" | docker login -u "$DOCKER_USERNAME" --password-stdin

COMPOSE_FILE=docker-compose.yml
docker-compose build
docker-compose push
