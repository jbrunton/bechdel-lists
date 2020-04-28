#!/bin/bash
set -e

export SHA=$(git rev-parse HEAD)

echo "$DOCKER_ACCESS_TOKEN" | docker login -u "$DOCKER_USERNAME" --password-stdin

docker build \
 -t $DOCKER_USERNAME/bechdel-lists-api-dev:latest \
 -t $DOCKER_USERNAME/bechdel-lists-api-dev:$SHA \
 -f ./api/Dockerfile.dev ./api

docker push $DOCKER_USERNAME/bechdel-lists-api-dev:latest

docker push $DOCKER_USERNAME/bechdel-lists-api-dev:$SHA
