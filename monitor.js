import fs from 'fs';
import venom from 'venom-bot';
import { precisaDesencurtar, desencurtarLink, corrigirLinkShopee, corrigirLinkAmazon } from './utils.js';

// Lê os afiliados do JSON
const afiliados = JSON.parse(fs.readFileSync('afiliados.json', 'utf8'));
const lojasPermitidas = Object.keys(afiliados);

// Criar a pasta public/ se não existir
if (!fs.existsSync("public")) {
    fs.mkdirSync("public");
}

// Inicializa o bot e salva o QR Code como imagem
venom
    .create({
        session: 'bot-promocoes',
        multidevice: true,
        headless: true, // Força o modo headless para rodar sem interface gráfica
        browserArgs: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
        ],
        puppeteerOptions: {
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        },
        catchQR: (base64Qr) => {
            console.log("📸 QR Code gerado! Acesse: /public/qr.png para escanear.");

            const base64Image = base64Qr.replace(/^data:image\/png;base64,/, "");
            fs.writeFileSync("public/qr.png", base64Image, 'base64');
        }
    })
    .then((client) => {
        console.log("✅ BOT INICIADO COM SUCESSO! Escaneie o QR Code para conectar.");
        start(client);
    })
    .catch((erro) => console.log("❌ ERRO AO INICIAR O BOT:", erro));

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
                const grupoDestino = 'SEU-GRUPO-ID';
                await client.sendText(grupoDestino, `🔗 Oferta imperdível! Pegue agora: ${linkOriginal}`);
            }
        } catch (error) {
            console.error("❌ Erro ao processar mensagem:", error);
        }
    });
}