# Bechdel Lists

[![Build Status](https://github.com/jbrunton/bechdel-demo/workflows/ci-build/badge.svg?branch=master)](https://github.com/jbrunton/bechdel-demo/actions?query=branch%3Amaster+workflow%3Aci-build)
[![Deployment Status](https://github.com/jbrunton/bechdel-demo/workflows/ci-deploy/badge.svg)](https://github.com/jbrunton/bechdel-demo/actions?workflow%3Aci-deploy)
[![Maintainability](https://api.codeclimate.com/v1/badges/88c63816d9055f3c1ac6/maintainability)](https://codeclimate.com/github/jbrunton/bechdel-demo/maintainability)

## What is this?

A small project that will (eventually) demo the following:

* A small microservices app using <b>docker-compose</b> for easy local development and deployments.
* A non-trivial, cleanly architected backend [API](https://github.com/jbrunton/bechdel-demo/tree/master/api) written using <b>Express</b>.
* A cleanly written [client app](https://github.com/jbrunton/bechdel-demo/tree/master/client) using <b>Vue.js</b>.

The app itself allows users to create lists of movies and assigns an aggregate Bechdel score for the list (based on the average). Bechdel scores are taken from the [bechdeltest.com API](https://bechdeltest.com/api/v1/doc).

## Development

Prerequisites: Git, Docker, Node, NPM.

    git clone git@github.com:jbrunton/bechdel-demo.git
    cd bechdel-demo
    TAG=latest docker-compose up

This will run the app at http://localhost:3001, though you'll need to prepare a development database to use it (see below).

### Configuring your development environment

For convenience you may wish to create a `.env` file in the project root directory. The easiest way to do this is to copy the example:

    cp example.env .env

Then you can omit the `TAG=latest` variable for most docker commands. See below for more about the other config options.

### Database preparation

You'll need to create and configure the database:

    docker-compose run api npm run db:migrate

### Seed data

For development purposes, it's useful to create some lists associated with your user. You can do this by adding the following to the project `.env` file:

    SEED_USER_EMAIL=my.email@example.com
    SEED_USER_NAME=My Name

Note that the email must be the one you use for Google Sign-In. If you use a Gmail address then this will need to be in the `@googlemail.com` format.

Once you have these variables set you can run the following command to create/update your user with some seed lists:

    docker-compose run api npm run db:seed

### Recreating the development database

At any point you can drop, create, migrate and seed the database like this:

    docker-compose run api npm run db:reset

### Override development defaults

By default docker-compose will map port 5432 to the postgres instance, and serve the client app on port 3001. You can change these values locally by adding the following to the project `.env` file:

    POSTGRES_LOCAL_PORT=7000
    NGINX_LOCAL_PORT=80

### Testing the API

For convenience the repository includes a Postman collection and environment. The files are:

    api/bechdel-demo.postman_collection.json
    api/bechdel-demo.postman_environment.json

The environment includes a variable `authEmail`. If you set this to your user's email, then you can authenticate at `/dev/signin`. This cuts out the Google Sign-In flow which [doesn't work with Postman](https://github.com/postmanlabs/postman-app-support/issues/7700).

If you wish to test the usual authentication endpoints with Postman you'll need an idtoken. In development mode there is a convenience page at http://localhost:3001/dev/idtoken which will show you one for your signed in user. You can then set the postman `idToken` environment variable to this value.

### Testing production builds

If you want to run the app locally in production mode (e.g. to test docker-compose files or a production build of the client app), then you'll need to ensure docker-compose uses only the production `docker-compose.yml` file (without the development overrides). You'll also need to provude some arguments to the nginx build:

    export NGINX_LISTEN_ENV=development
    export NGINX_CERTS_DIR=./services/nginx
    docker-compose -f docker-compose.yml up

To run a particular production instance, add the TAG variable:

    TAG=my-tag docker-compose -f docker-compose.yml up

(You can also set the `COMPOSE_FILE` environment variable to save repeating the file. See the [docs](https://docs.docker.com/compose/reference/envvars/#compose_file).)

To test anything that requires a database connection you'll need to use your own database, as docker-compose won't run its own postgres container in production. You can specify a database with the POSTGRES_CONNECTION environment variable, and you'll likely need to disable SSL checks:

    export POSTGRES_DISABLE_SSL=1
    export POSTGRES_CONNECTION=postgres://my_user:my_password@host.docker.internal:5432/my_test_db
    docker-compose -f docker-compose.yml up

(The above example assumes a local database running on your development machine.)

You can create and configure the database as usual (i.e. with `docker-compose run api npm run db:create`, etc).

### Automated tests

Unit tests for a service can be executed from within the service directory. For example:

    cd services/client
    npm run test:unit

Integration tests must be run from within the container for the service, and moreover may require creation of the test database on first time use:

    docker-compose run api npm run db:test:create
    docker-compose run api npm run test:integration

