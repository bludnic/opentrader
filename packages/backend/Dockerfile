FROM node:16-alpine as development

WORKDIR /var/app/backend

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build --dev

CMD ["node", "dist/main"]
