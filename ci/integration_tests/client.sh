#!/bin/bash
set -e

cd ${WORKSPACE}/services/client
npm install

cd ${WORKSPACE}
docker-compose up -d client
docker-compose run api bin/rails db:migrate RAILS_ENV=development
docker-compose run cypress
