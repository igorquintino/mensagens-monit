const puppeteer = require('puppeteer');

const encurtadores = ['bit.ly', 'tidd.ly', 'amzn.to'];
const shopeeAfiliadoID = "id_7RhfldmMti"; // Substitua pelo seu ID de afiliado Shopee
const amazonAfiliadoID = "igorquintin09-20"; // Substitua pelo seu ID de afiliado Amazon

async function desencurtarLink(link) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    try {
        await page.goto(link, { waitUntil: 'domcontentloaded' });
        const urlReal = page.url();
        await browser.close();
        return urlReal;
    } catch (error) {
        console.log('❌ Erro ao desencurtar:', error);
        await browser.close();
        return link;
    }
}

function precisaDesencurtar(link) {
    return encurtadores.some(dom => link.includes(dom));
}

// Função para corrigir links da Shopee
function corrigirLinkShopee(link) {
    if (!link.includes("utm_medium=affiliates")) {
        return `${link}?utm_campaign=${shopeeAfiliadoID}&utm_medium=affiliates&utm_source=an_18371560551`;
    }
    return link; // Se já for afiliado, mantém
}

// Função para corrigir links da Amazon
function corrigirLinkAmazon(link) {
    if (!link.includes("tag=")) {
        return `${link}?linkCode=ml1&tag=${amazonAfiliadoID}`;
    }
    return link; // Se já for afiliado, mantém
}

module.exports = { desencurtarLink, precisaDesencurtar, corrigirLinkShopee, corrigirLinkAmazon };