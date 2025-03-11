# Usa a imagem oficial do Node.js
FROM node:18

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia apenas o package.json
COPY package.json ./

# Instala as dependências
RUN npm install

# Copia o código do bot para o container
COPY bot.js ./

# Define a variável de ambiente para evitar prompts do Telegram
ENV NODE_ENV=production

# Comando para iniciar o bot automaticamente no Railway
CMD ["node", "bot.js"]
