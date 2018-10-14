FROM node:10-alpine as base

ARG REACT_APP_HOST

WORKDIR /app

COPY ./package*.json ./

RUN npm install --only=production

COPY . .

RUN echo "REACT_APP_HOST = $REACT_APP_HOST"
RUN REACT_APP_HOST=${REACT_APP_HOST} npm run build



FROM node:alpine

WORKDIR /app

COPY --from=base /app/package.json ./

RUN npm install --only=production

COPY --from=base /app/build ./build/

EXPOSE 8080

ENTRYPOINT ["npm"]

CMD ["start"]
