#!/bin/bash
set -e

echo "DEPLOYMENT_FILE: $DEPLOYMENT_FILE"
export POSTGRES_CONNECTION
docker-compose --file $DEPLOYMENT_FILE --project-directory . \
  up --detach --no-build --remove-orphans
