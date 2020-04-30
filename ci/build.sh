#!/bin/bash
set -e

export COMPOSE_FILE=docker-compose.yml

echo "$DOCKER_ACCESS_TOKEN" | docker login -u "$DOCKER_USERNAME" --password-stdin

docker-compose build
docker-compose push
