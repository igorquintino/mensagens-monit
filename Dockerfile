# Usa a imagem oficial do Node.js
FROM node:18

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos do projeto para o container
COPY package.json package-lock.json ./
COPY bot.js ./

# Instala as dependências
RUN npm install

# Define a variável de ambiente para evitar prompts do Telegram
ENV NODE_ENV=production

# Comando para iniciar o bot automaticamente no Railway
CMD ["node", "bot.js"]