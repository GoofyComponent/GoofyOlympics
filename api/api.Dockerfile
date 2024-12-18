FROM node:20.12.0-alpine

WORKDIR /app
COPY package.json ./

RUN npm install
COPY . .
ENV NODE_ENV=production
ENV TZ=Etc/UTC


COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

CMD ["npm", "start"]

ENTRYPOINT ["docker-entrypoint.sh"]