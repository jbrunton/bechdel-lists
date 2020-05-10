#!/bin/bash
set -e

docker-compose run api npm run test:integration
