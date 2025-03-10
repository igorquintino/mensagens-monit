import fs from "fs";
import venom from "venom-bot";
import { precisaDesencurtar, desencurtarLink, corrigirLinkShopee, corrigirLinkAmazon } from "./utils.js";

// Lê os afiliados do JSON
const afiliados = JSON.parse(fs.readFileSync("afiliados.json", "utf8"));
const lojasPermitidas = Object.keys(afiliados);

// Criar a pasta public/ se não existir
if (!fs.existsSync("public")) {
  fs.mkdirSync("public");
}

// Inicializa o Venom-Bot sem Puppeteer
venom
  .create({
    session: "bot-promocoes",
    multidevice: true, // Compatível com WhatsApp Multi-Dispositivo
    disableWelcome: true, // Remove mensagem de boas-vindas
    logQR: false, // Evita logs visuais do QR Code
    autoClose: 0, // Impede que o bot feche sozinho
    useChrome: false, // 🚀 ESSENCIAL: NÃO usa Puppeteer
  })
  .then((client) => {
    console.log("✅ BOT INICIADO COM SUCESSO! Escaneie o QR Code para conectar.");
    start(client);
  })
  .catch((erro) => {
    console.error("❌ ERRO AO INICIAR O BOT:", erro);
    process.exit(1);
  });

async function start(client) {
  client.onMessage(async (message) => {
    try {
      const regexUrl = /(https?:\/\/[^\s]+)/g;
      const links = message.body.match(regexUrl);

      if (links) {
        let linkOriginal = links[0]; // Pega o primeiro link encontrado

        // Se for um link encurtado, desencurta antes de processar
        if (precisaDesencurtar(linkOriginal)) {
          console.log(`🔍 Desencurtando link: ${linkOriginal}`);
          linkOriginal = await desencurtarLink(linkOriginal);
        }

        // Se for um link da Shopee, garantir que é afiliado
        if (linkOriginal.includes("shopee.com.br")) {
          linkOriginal = corrigirLinkShopee(linkOriginal);
        }

        // Se for um link da Amazon, garantir que é afiliado
        if (linkOriginal.includes("amazon.com.br")) {
          linkOriginal = corrigirLinkAmazon(linkOriginal);
        }

        console.log(`[🚀 REENVIANDO] ${linkOriginal}`);

        // Substitua 'SEU-GRUPO-ID' pelo ID real do grupo para onde as promoções serão enviadas
        const grupoDestino = "SEU-GRUPO-ID";
        await client.sendText(grupoDestino, `🔗 Oferta imperdível! Pegue agora: ${linkOriginal}`);
      }
    } catch (error) {
      console.error("❌ Erro ao processar mensagem:", error);
    }
  });
}