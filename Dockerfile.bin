# Usa uma imagem oficial do Node.js como base
FROM node:18

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos do projeto para dentro do container
COPY . .

# Instala dependências do sistema para Puppeteer e outras libs necessárias
RUN apt-get update && apt-get install -y \
  libnss3 \
  libatk1.0-0 \
  libatk-bridge2.0-0 \
  libcups2 \
  libxkbcommon-x11-0 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  libgbm1 \
  libasound2 \
  libpangocairo-1.0-0 \
  libgobject-2.0-0 \
  && rm -rf /var/lib/apt/lists/*

# Instala as dependências do projeto
RUN npm install

# Define a variável de ambiente para evitar problemas com Puppeteer no Railway
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Inicia o bot automaticamente quando o Railway rodar
CMD ["node", "server.js"]
