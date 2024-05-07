FROM node:lts-alpine20.12.2 as build

WORKDIR /app
COPY package.json ./

RUN npm ci
COPY . .

RUN npm start
