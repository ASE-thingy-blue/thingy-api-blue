# Do not build from this Dockerfile directly, use the Docker compose files testing.yml and production.yml

FROM node:8.7

MAINTAINER salim@hermidas.ch

ENV appdir /usr/src/app/
RUN mkdir -p $appdir
WORKDIR $appdir

# Combine RUN apt-get update with apt-get install in the same RUN statement to avoid caching issues (https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices/)
RUN apt-get update && apt-get install -y build-essential
RUN apt-get clean

RUN npm install -g node-gyp
RUN npm install

EXPOSE 8080

# Drop privileges according to Docker and Node.js Best Practices (https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md)
USER node

CMD ["node", "."]
