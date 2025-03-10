import venom from "venom-bot";
import fs from "fs-extra";

venom
  .create({
    session: "bot-promocoes",
    multidevice: true,
    disableWelcome: true,
    logQR: false,
    catchQR: (base64Qr) => {
      console.log("📸 QR Code gerado! Salvando imagem...");

      const base64Image = base64Qr.replace(/^data:image\/png;base64,/, "");
      fs.writeFileSync("qr-code.png", base64Image, "base64");

      console.log("✅ QR Code salvo em qr-code.png. Escaneie para conectar.");
    },
  })
  .then((client) => {
    console.log("✅ BOT INICIADO COM SUCESSO NO RAILWAY!");
    start(client);
  })
  .catch((erro) => {
    console.error("❌ ERRO AO INICIAR O BOT:", erro);
    process.exit(1);
  });

async function start(client) {
  client.onMessage(async (message) => {
    console.log("📩 Mensagem recebida:", message.body);

    if (message.body.toLowerCase() === "ping") {
      await client.sendText(message.from, "pong! 🏓");
    }
  });
}