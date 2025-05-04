FROM node:20-alpine

WORKDIR /app

COPY frontend/package.json ./

RUN yarn 

COPY frontend .

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]