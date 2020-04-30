#!/bin/bash
set -e

export COMPOSE_FILE=docker-compose.yml

echo "$DOCKER_ACCESS_TOKEN" | docker login -u "$DOCKER_USERNAME" --password-stdin

export DEPLOYMENT_FILE=deployments/docker-compose.${TAG}.yml
docker-compose -v
docker-compose pull
docker-compose config --resolve-image-digests > $DEPLOYMENT_FILE

echo "Generated deployment file $DEPLOYMENT_FILE:"
cat $DEPLOYMENT_FILE

git commit -m "Generated deployment file for $TAG"
