ARG REACT_APP_HOST=192.168.0.83

FROM node:10-alpine as base

WORKDIR /app

COPY ./package*.json ./

RUN npm install

COPY . .

RUN echo "asdfsdsdfg fsd sdfg  $REACT_APP_HOST"
RUN REACT_APP_HOST=$REACT_APP_HOST npm run build



FROM node:alpine

WORKDIR /app

COPY --from=base /app/package.json ./

RUN npm install --only=production

COPY --from=base /app/build ./build/

EXPOSE 8080

ENTRYPOINT ["npx"]

CMD ["http-server", "build"]
