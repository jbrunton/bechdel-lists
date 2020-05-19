# client

## Running tests

You can run unit tests locally like this from `services/client`:

  npm run test:unit

The usual way to run integration tests is like this (from `services/client`):

  docker-compose up client -d
  cd services/client
  npm run test:integration

This will run Cypress on your development machine against the web app running at http://localhost:3030. However, typically you'll want to open the test suite with Cypress in order to review / debug the results:

  npm run test:integration:open

To run Cypress in a container as it would be in a CI environment, you can do this (from the project root directory):

  export COMPOSE_FILE=$(./get-compose-file.sh cypress)
  docker-compose up cypress

To debug issues specific to running Cypress in a container:

1. Follow the steps to install XQuartz here: https://sourabhbajaj.com/blog/2017/02/07/gui-applications-docker-mac/.
2. Add localhost to the XQuarts access control list:

    /usr/X11/bin/xhost + localhost

3. Use the docker-compose.cy-open.yml docker file like this:
  
    export COMPOSE_FILE=$(./get-compose-file.sh cy-open)
    docker-compose up cypress

Note: you may also need to setup the database first:

    docker-compose run api bin/rails db:migrate RAILS_ENV=development

See [this article](https://www.cypress.io/blog/2019/05/02/run-cypress-with-a-single-docker-command/#Docker-compose) for more details.
