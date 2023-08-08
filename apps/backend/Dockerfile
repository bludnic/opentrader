FROM node:16-alpine as development

WORKDIR /var/app/backend

COPY package*.json ./

RUN npm install

COPY . .

ENV NODE_ENV production
ENV ENVIRONMENT testing

RUN npm run build

CMD ["node", "dist/main"]
