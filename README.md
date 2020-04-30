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

    docker-compose run api npm run db:migrate

### Seed data

For development purposes, it's useful to create some lists associated with your user. You can do this by adding the following to a `.env` file in the project root directory:

    SEED_USER_EMAIL=my.email@example.com
    SEED_USER_NAME=My Name

Then you can run the following command (again, from the `api/` directory) to create/update your user with some seed lists:

    docker-compose run api npm run db:seed

### Recreating the development database

At any point you can drop, create, migrate and seed the database like this:

    docker-compose run api npm run db:reset

### Override development defaults

By default docker-compose will map port 5432 to the postgres instance, and serve the client app on port 3001. You can change these values locally by adding the following to a `.env` file in the project root directory:

    POSTGRES_LOCAL_PORT=7000
    NGINX_LOCAL_PORT=80

### Testing the API

For convenience the repository includes a Postman collection and environment. The files are:

    api/bechdel-demo.postman_collection.json
    api/bechdel-demo.postman_environment.json

The environment includes a variable `authEmail`. If you set this to your user's email, then you can authenticate at `/dev/signin`. This cuts out the Google Sign-In flow which [doesn't work with Postman](https://github.com/postmanlabs/postman-app-support/issues/7700).

If you wish to test the usual authentication endpoints with Postman you'll need an idtoken. There is a convenience page at http://localhost:3001/dev/idtoken which will show you one for your signed in user. You can then set the postman `idToken` environment variable to this value.
