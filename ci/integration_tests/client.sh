#!/bin/bash
set -e

cd ${WORKSPACE}/services/client
npm install

cd ${WORKSPACE}
docker-compose up -d
docker-compose run api bin/rails db:migrate RAILS_ENV=development
export COMPOSE_FILE=docker-compose.yml:docker-compose.override.yml:docker-compose.cypress.yml
docker-compose run cypress
