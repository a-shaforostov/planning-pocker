FROM node:10-alpine as base

WORKDIR /app

COPY ./package*.json ./

RUN npm install --only=production

COPY . .

EXPOSE 3002

CMD ["node", "app.js"]
