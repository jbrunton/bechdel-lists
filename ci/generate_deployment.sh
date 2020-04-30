#!/bin/bash
set -e

export TAG=v0.0.1
export DEPLOYMENT_FILE=deployments/docker-compose.${TAG}.yml
docker-compose -f docker-compose.yml config --resolve-image-digests > $DEPLOYMENT_FILE

echo "Generated deployment file $DEPLOYMENT_FILE:"
cat $DEPLOYMENT_FILE
