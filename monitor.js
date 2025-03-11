import puppeteer from 'puppeteer';
import fs from 'fs';
import venom from 'venom-bot';

// Função para iniciar o Puppeteer
async function launchBrowser() {
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-accelerated-2d-canvas",
            "--no-first-run",
            "--no-zygote",
            "--single-process",
            "--disable-gpu"
        ]
    });
    return browser;
}

// Inicializa o bot do WhatsApp
venom
    .create({
        session: 'bot-promocoes',
        multidevice: true,
        browserArgs: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ],
        puppeteerOptions: {
            executablePath: '/usr/bin/google-chrome-stable'
        }
    })
    .then(async (client) => {
        console.log("✅ BOT INICIADO COM SUCESSO!");
        const browser = await launchBrowser();
        start(client, browser);
    })
    .catch((erro) => console.log("❌ ERRO AO INICIAR O BOT:", erro));

async function start(client, browser) {
    client.onMessage(async (message) => {
        console.log("Mensagem recebida:", message.body);
        await client.sendText(message.from, "📢 O bot está funcionando!");
    });
}