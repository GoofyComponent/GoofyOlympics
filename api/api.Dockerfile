FROM node:20.12.0-alpine

WORKDIR /app
COPY package.json ./

RUN npm install
COPY . .
ENV NODE_ENV=production
ENV TZ=Etc/UTC

#RUN npx --yes prisma migrate deploy
#RUN npm run convert-csv

CMD ["npm", "start"]