#!/bin/bash
set -e

cd bechdel-demo
docker-compose down
git fetch
git checkout $DEPLOYMENT_SHA
docker-compose pull
docker-compose up -d --no-build
