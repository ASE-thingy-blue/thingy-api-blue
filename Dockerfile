# Do not build from this Dockerfile directly, use the Docker compose files testing.yml and production.yml

FROM node:8.7

MAINTAINER salim@hermidas.ch

ENV appdir /usr/src/app/
RUN mkdir -p $appdir
WORKDIR $appdir

RUN npm install

EXPOSE 8080

# Drop privileges according to Docker and Node.js Best Practices (https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md)
USER node

CMD ["node", "."]
