FROM node:8.7

MAINTAINER salim@hermidas.ch

ENV appdir /usr/src/app/
RUN mkdir -p $appdir
WORKDIR $appdir

ADD . .

RUN npm install

EXPOSE 8080

CMD ["node", "."]
