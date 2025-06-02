FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install  # Corrigido de rpm para npm

COPY . .

RUN npm run build  # Corrigido de rpm para npm

EXPOSE 3000

CMD ["npm", "start"]