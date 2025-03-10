import { chromium } from 'playwright';

// Lista de domínios que precisam ser desencurtados
const dominiosEncurtadores = [
    "bit.ly",
    "tinyurl.com",
    "shp.ee",
    "s.shopee.com.br",
    "short.amz.com",
    "t.co"
];

// Verifica se o link precisa ser desencurtado
export function precisaDesencurtar(link) {
    return dominiosEncurtadores.some(dominio => link.includes(dominio));
}

// Função para desencurtar links usando Playwright
export async function desencurtarLink(url) {
    try {
        const browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const finalUrl = page.url();
        await browser.close();
        return finalUrl || url;
    } catch (error) {
        console.error("❌ Erro ao desencurtar link:", error);
        return url; // Retorna o link original se der erro
    }
}

// Função para corrigir links da Shopee e garantir que sejam de afiliado
export function corrigirLinkShopee(link) {
    if (link.includes("shopee.com.br") && !link.includes("utm_source")) {
        return link + "&utm_source=afiliado_exemplo"; // Substitua pelo seu código de afiliado
    }
    return link;
}

// Função para corrigir links da Amazon e garantir que sejam de afiliado
export function corrigirLinkAmazon(link) {
    if (link.includes("amazon.com.br") && !link.includes("tag=")) {
        return link + "&tag=seuAfiliadoAmazon"; // Substitua pelo seu código de afiliado
    }
    return link;
}