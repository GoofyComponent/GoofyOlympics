FROM node:20.12.0-alpine

WORKDIR /app
COPY package.json ./

RUN npm install
COPY . .
ENV NODE_ENV=production
ENV TZ=Etc/UTC

CMD ["npm", "start"]