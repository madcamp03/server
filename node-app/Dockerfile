# node-app/Dockerfile
FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN apt-get update && apt-get install -y default-mysql-client

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
