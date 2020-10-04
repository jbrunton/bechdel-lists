# Bechdel Lists

[![Build Status](https://github.com/jbrunton/bechdel-lists/workflows/ci-build/badge.svg?branch=develop)](https://github.com/jbrunton/bechdel-lists/actions?query=branch%3Adevelop+workflow%3Aci-build)
[![Deployment Status](https://github.com/jbrunton/bechdel-lists/workflows/ci-deploy/badge.svg)](https://github.com/jbrunton/bechdel-lists/actions?workflow%3Aci-deploy)
[![Maintainability](https://api.codeclimate.com/v1/badges/ebcd3967ab1563d2b12a/maintainability)](https://codeclimate.com/github/jbrunton/bechdel-lists/maintainability)

## What is this?

A small project that will (eventually) demo the following:

* A small microservices app using <b>docker-compose</b> for easy local development and deployments.
* A non-trivial backend [API](https://github.com/jbrunton/bechdel-lists/tree/develop/api) written with Ruby on Rails.
* A [client app](https://github.com/jbrunton/bechdel-lists/tree/develop/client) using <b>Vue.js</b>.
* Unit and integration testing techniques using docker-compose and Cypress (and various other tools).

The app itself allows users to create lists of movies and visualize trends in the Bechdel score over time, and by genre. Bechdel scores are taken from the [bechdeltest.com API](https://bechdeltest.com/api/v1/doc). You can try it out [here](http://bechdel-lists.jbrunton.com/) (example visualizations [here](https://bechdel-lists.jbrunton.com/browse/lists/1/charts)).

<a href="https://github.com/jbrunton/bechdel-lists/blob/develop/bechdel-lists-screenshot.png">
    <img src="https://raw.githubusercontent.com/jbrunton/bechdel-lists/develop/bechdel-lists-screenshot.png" width="472" height="372">
</a>

## Development

Prerequisites: Git, Docker, Node, NPM.

    git clone git@github.com:jbrunton/bechdel-lists.git
    cd bechdel-lists
    TAG=latest docker-compose up

This will run the app at http://localhost:3001, though you'll need to prepare a development database to use it (see below).

### Configuring your development environment

For convenience you may wish to create a `.env` file in the project root directory. The easiest way to do this is to copy the example:

    cp .env.example .env

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

    api/bechdel-lists.postman_collection.json
    api/bechdel-lists.postman_environment.json

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

    cs services/api
    bin/rails spec:unit

Integration tests must be run from within the container for the service, and moreover may require creation of the test database on first time use:

    docker-compose run api bin/rails db:test:prepare
    docker-compose run api bin/rails spec:integration
