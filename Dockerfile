FROM node:20-alpine

WORKDIR /homecontrol-ui

COPY public/ /homecontrol-ui/public
COPY src/ /homecontrol-ui/src
COPY package.json /homecontrol-ui/

CMD ["yarn", "dev"]