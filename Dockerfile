# STAGE 1: Setup
################################
FROM node:20-bookworm AS setup
LABEL maintainer="web@ikehunter.dev"

WORKDIR /app

COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
COPY ./tsconfig.json ./tsconfig.json

USER root

RUN npm install -g npm && \
    npm install -g typescript && \
    npm install -g rimraf && \
    npm install 

# STAGE 2: Build
################################
FROM setup AS build

EXPOSE 8000

COPY ./jest.config.ts ./jest.config.ts
COPY ./src ./src

RUN npm run build

VOLUME "/app/logs"

CMD ["npm", "start"]



