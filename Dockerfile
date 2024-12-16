FROM node:22-alpine

WORKDIR /homecontrol-ui

COPY package.json yarn.lock .yarnrc.yml /homecontrol-ui/
RUN corepack enable
RUN yarn install

COPY . .

CMD ["yarn", "dev"]