#!/bin/bash
set -e

export SHA=$(git rev-parse HEAD)

echo "Running build for SHA $SHA"

#docker build \
#  -t jbrunton/bechdel-lists-api:latest \
#  -t jbrunton/bechdel-lists-api:$SHA \
#  -f ./api/Dockerfile.dev ./api

#docker push jbrunton/bechdel-lists-api:latest

#docker push jbrunton/bechdel-lists-api:$SHA
