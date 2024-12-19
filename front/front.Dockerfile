FROM node:20.13.1-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm i
COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html


CMD ["/usr/sbin/nginx", "-g", "daemon off;"]