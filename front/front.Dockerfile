FROM node:20.13.1-alpine as build

WORKDIR /app

ARG VITE_MAPTILER_PUBLIC
ENV VITE_MAPTILER_PUBLIC=${VITE_MAPTILER_PUBLIC}

COPY package.json ./
COPY package-lock.json ./

RUN npm ci
COPY . .

RUN npm run build

FROM nginx:alpine

ARG VITE_MAPTILER_PUBLIC
ENV VITE_MAPTILER_PUBLIC=${VITE_MAPTILER_PUBLIC}

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

CMD ["/usr/sbin/nginx", "-g", "daemon off;"]