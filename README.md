# Bechdel Lists

## What is this?

A small project that will (eventually) demo the following:

* A small microservices app using <b>docker-compose</b> for easy local development and deployments.
* A non-trivial, cleanly architected backend [API](https://github.com/jbrunton/bechdel-demo/tree/master/api) written using <b>Express</b>.
* A cleanly written [client app](https://github.com/jbrunton/bechdel-demo/tree/master/client) using <b>Vue.js</b>.

The app itself allows users to create lists of movies and assigns an aggregate Bechdel score for the list (based on the average). Bechdel scores are taken from the [bechdeltest.com API](https://bechdeltest.com/api/v1/doc).

## Development

Prerequisites: Git, Docker, Node, NPM.

    git clone git@github.com:jbrunton/bechdel-demo.git
    docker-compose up

This will run the app at http://localhost:3001, though you'll need to prepare a development database to use it (see below).

### Database preparation

You'll need to create and configure the database:

    cd api
    npm run db:create
    npm run db:migrate

### Seed data

For development purposes, it's useful to create some lists associated with your user. You can do this by creating a `.env` file in the `api/` directory like this:

    SEED_USER_EMAIL=my.email@example.com
    SEED_USER_NAME=My Name

Then you can run the following command (again, from the `api/` directory) to create/update your user with some seed lists:

    npm run db:seed

### Recreating the development database

At any point you can drop, create, migrate and seed the database like this:

    npm run db:reset

### Testing the API

For convenience the repository includes a Postman collection and environment. The files are:

    api/bechdel-demo.postman_collection.json
    api/bechdel-demo.postman_environment.json

The environment includes a variable `authEmail`. If you set this to your user's email, then you can authenticate at `/dev/signin`. This cuts out the Google Sign-In flow which [doesn't work with Postman](https://github.com/postmanlabs/postman-app-support/issues/7700).
