# Node.JS Thingy Web API

A Representational State Transfer API for the [Nordic Thingy:52](http://www.nordicsemi.com/thingy).

The Thingy Web API connects the [Thingy Intermediate Gateway](https://github.com/ASE-thingy-blue/thingy-intermediate-blue), the database and the [Thingy Client Frontend](https://github.com/ASE-thingy-blue/thingy-client-blue) and interpolates data sent between these endpoints.

## Database

The Thingy Web API uses MongoDB as data storage. The associated database is set up together with the Web API. Using `docker-compose` the two instances can be restarted independently.

Details can be found in the Docker compose files `testing.yml` and `production.yml`.

## Usage

When using in a production environment, this project should not be run directly. Instead the [Thingy Web API Docker Image](https://github.com/ASE-thingy-blue/thingy-api-blue-docker) should be used to deploy the Thingy Web API.

For development purposes the project can still be run directly by navigating to the project directory and running

    npm install --save-dev
    node .
