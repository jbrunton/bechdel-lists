#!/bin/bash
set -e

export SHA=$(git rev-parse HEAD)

echo "$DOCKER_ACCESS_TOKEN" | docker login -u "$DOCKER_USERNAME" --password-stdin

declare -a StringArray=("api" "client" "nginx")
 
# Iterate the string array using for loop
for service in ${StringArray[@]}; do
  echo "Building $service service..."

  docker build \
    -t $DOCKER_USERNAME/bechdel-lists-$service:latest \
    -t $DOCKER_USERNAME/bechdel-lists-$service:$SHA \
    -f ./$service/Dockerfile ./$service

  docker push $DOCKER_USERNAME/bechdel-lists-$service:latest
  docker push $DOCKER_USERNAME/bechdel-lists-$service:$SHA
done
