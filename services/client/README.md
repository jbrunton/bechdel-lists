# client

## Running tests

You can run unit tests locally like this from `services/client`:

  npm run test:unit

The usual way to run integration tests is like this (from `services/client`):

  docker-compose up client -d
  npm run test:integration

This will run Cypress on your development machine against the web app running at http://localhost:3030.

To run Cypress in a container as it would be in a CI environment, you can do this (from the project root directory):

  docker-compose up cypress

To debug issues specific to running Cypress in a container:

1. Follow the steps to install XQuartz here: https://sourabhbajaj.com/blog/2017/02/07/gui-applications-docker-mac/
2. Use the docker-compose.cy-open.yml docker file like this:
  
    export COMPOSE_FILE=docker-compose.yml:docker-compose.override.yml:docker-compose.cy-open.yml
    docker-compose up cypress

See [this article](https://www.cypress.io/blog/2019/05/02/run-cypress-with-a-single-docker-command/#Docker-compose) for more details.
