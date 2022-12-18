FROM node:16-alpine as development

WORKDIR /var/app/frontend

COPY package*.json ./

RUN npm install

COPY . .
RUN npm run build

CMD npm run start:prod
