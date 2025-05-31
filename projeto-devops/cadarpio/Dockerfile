# Use uma imagem Node.js como base. Escolha a versão que você usa localmente.
# next.js recomenda node 18 ou superior
FROM node:20-alpine

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

#
COPY package*.json ./


RUN npm install


COPY . .

RUN npm run build

EXPOSE 3000


CMD ["npm", "start"]