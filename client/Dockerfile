FROM node:10-alpine as base

WORKDIR /app

COPY ./package*.json ./

RUN npm install

COPY . .

RUN REACT_APP_HOST=192.168.0.83 npm run build
RUN echo REACT_APP_HOST - ${REACT_APP_HOST}



FROM node:alpine

WORKDIR /app

COPY --from=base /app/package.json ./

RUN npm install --only=production

COPY --from=base /app/build ./build/

EXPOSE 8080

ENTRYPOINT ["npx"]

CMD ["http-server", "build"]
