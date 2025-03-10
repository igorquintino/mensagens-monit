import fetch from 'node-fetch';

// Lista de domínios encurtadores que precisam ser resolvidos
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

// Função para desencurtar links sem Puppeteer
export async function desencurtarLink(url) {
    try {
        if (!url.startsWith("http")) {
            console.error("⚠️ Link inválido:", url);
            return url;
        }

        const response = await fetch(url, { method: 'HEAD', redirect: 'follow' });
        return response.url || url; // Retorna a URL final após redirecionamentos
    } catch (error) {
        console.error("❌ Erro ao desencurtar link:", error);
        return url; // Retorna o link original se der erro
    }
}

// Função para corrigir links da Shopee e garantir que sejam de afiliado
export function corrigirLinkShopee(link) {
    if (link.includes("shopee.com.br") && !link.includes("utm_source")) {
        return link + (link.includes("?") ? "&" : "?") + "utm_source=afiliado_exemplo"; // Substitua pelo seu código de afiliado
    }
    return link;
}

// Função para corrigir links da Amazon e garantir que sejam de afiliado
export function corrigirLinkAmazon(link) {
    if (link.includes("amazon.com.br") && !link.includes("tag=")) {
        return link + (link.includes("?") ? "&" : "?") + "tag=seuAfiliadoAmazon"; // Substitua pelo seu código de afiliado
    }
    return link;
}