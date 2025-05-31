FROM node:20-alpine3.21

RUN mkdir -p /home/app
WORKDIR /home/app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

EXPOSE 3000

CMD ["node", "testServer.js" ]
