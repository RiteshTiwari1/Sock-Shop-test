FROM node:14

WORKDIR /src/app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

CMD ["npm", "test"]