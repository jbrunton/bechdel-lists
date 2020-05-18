#!/bin/bash
set -e

cd ${WORKSPACE}/services/client
npm install

cd ${WORKSPACE}
docker-compose up -d
docker-compose run api bin/rails db:migrate RAILS_ENV=development
export COMPOSE_FILE=$(./get-compose-file cypress)
docker-compose run cypress
