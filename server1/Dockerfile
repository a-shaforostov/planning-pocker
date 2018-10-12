FROM node:10-alpine as base

WORKDIR /app

COPY ./package*.json ./

RUN npm install --only=production

COPY . .

EXPOSE 3000 3002

CMD ["node", "app1.js"]
