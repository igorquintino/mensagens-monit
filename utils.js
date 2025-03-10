export function precisaDesencurtar(link) {
    return link.includes("bit.ly") || link.includes("tidd.ly") || link.includes("amzn.to");
}

export async function desencurtarLink(link) {
    // Adicione aqui a lógica para desencurtar o link
    return link; // Apenas retorna o link original por enquanto
}

export function corrigirLinkShopee(link) {
    return link.includes("?") ? `${link}&utm_source=afiliado` : `${link}?utm_source=afiliado`;
}

export function corrigirLinkAmazon(link) {
    return link.includes("?") ? `${link}&tag=SEU_CODIGO_AFFILIADO` : `${link}?tag=SEU_CODIGO_AFFILIADO`;
}