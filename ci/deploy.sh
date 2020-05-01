#!/bin/bash
set -e

DOCKER_RUN="docker-compose --file $DEPLOYMENT_FILE --project-directory ."

$DOCKER_RUN pull
$DOCKER_RUN up --detach --no-build --remove-orphans
