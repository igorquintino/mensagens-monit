import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import TelegramBot from 'node-telegram-bot-api';

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const telegramBot = new TelegramBot(TELEGRAM_TOKEN, { polling: false });

app.post('/webhook-whatsapp', (req, res) => {
    const mensagemRecebida = req.body.Body;
    console.log("Mensagem original:", mensagemRecebida);

    const mensagemFormatada = processarMensagem(mensagemRecebida);

    if (mensagemFormatada) {
        telegramBot.sendMessage(TELEGRAM_CHAT_ID, mensagemFormatada)
            .then(() => console.log("✅ Mensagem enviada para o Telegram!"))
            .catch(err => console.error("❌ Erro ao enviar mensagem:", err));
    } else {
        console.log("⚠️ Mensagem ignorada (não contém link)");
    }

    res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Webhook rodando na porta ${PORT}`));

function processarMensagem(mensagem) {
    const regexLink = /(https?:\/\/[^\s]+)/g;
    const linksEncontrados = mensagem.match(regexLink);

    if (!linksEncontrados) return null;

    const linkOriginal = linksEncontrados[0];

    const linkAfiliado = linkOriginal.includes("amazon") 
        ? linkOriginal + "?tag=SEU_CODIGO_AFILIADO"
        : linkOriginal;

    return `🔥 Promoção Detectada! 🔥\n\n${mensagem}\n\n🔗 *Link com nosso cupom:* ${linkAfiliado}`;
}
