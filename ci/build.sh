#!/bin/bash
set -e

export SHA=$(git rev-parse HEAD)

echo "$DOCKER_ACCESS_TOKEN" | docker login -u "$DOCKER_USERNAME" --password-stdin

docker-compose -f docker-compose.yml build
docker-compose push
