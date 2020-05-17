#!/bin/bash
set -e

cd $WORKSPACE
docker-compose run api bin/rails db:test:prepare
docker-compose run api bin/rails spec
