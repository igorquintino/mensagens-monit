const fs = require('fs');
const venom = require('venom-bot');
const { desencurtarLink, precisaDesencurtar, corrigirLinkShopee, corrigirLinkAmazon } = require('./utils');

const afiliados = JSON.parse(fs.readFileSync('afiliados.json', 'utf8'));
const lojasPermitidas = Object.keys(afiliados);

// Função para substituir o link pelo link de afiliado correto
function substituirPorAfiliado(link) {
    for (const loja of lojasPermitidas) {
        if (link.includes(loja)) {
            return link + afiliados[loja]; // Adiciona o código de afiliado correto
        }
    }
    return link;
}

// Inicializa o bot
venom
    .create({
        session: 'bot-promocoes',
        multidevice: true
    })
    .then((client) => start(client))
    .catch((erro) => console.log(erro));

async function start(client) {
    client.onMessage(async (message) => {
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

            // Agora, substituímos pelo link de afiliado
            const linkAfiliado = substituirPorAfiliado(linkOriginal);
            const novaMensagem = formatarMensagem(message.body, linkAfiliado);

            console.log(`[🚀 REENVIANDO] ${novaMensagem}`);
            await client.sendText('SEU-GRUPO-ID', novaMensagem);
        }
    });
}