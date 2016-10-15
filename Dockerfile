FROM node

ARG NPM_TOKEN

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json .
COPY agenda.js .
COPY .npmrc .npmrc

RUN npm install
RUN rm -f .npmrc


CMD [ "npm", "start" ]