#!/bin/bash
set -e

export CLIENT_DIR=$WORKSPACE/services/client

cd $CLIENT_DIR
npm install

cd $WORKSPACE
docker-compose up -d
docker run -v $CLIENT_DIR:/e2e -w /e2e cypress/included:4.5.0
