import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import input from "input"; // Para pedir o código de login no terminal

const apiId = YOUR_API_ID; // Substitua pelo seu api_id
const apiHash = "YOUR_API_HASH"; // Substitua pelo seu api_hash
const stringSession = new StringSession(""); // Deixe vazio no primeiro login

const client = new TelegramClient(stringSession, apiId, apiHash, {
  connectionRetries: 5,
});

async function run() {
  console.log("Iniciando...");
  await client.start({
    phoneNumber: async () => await input.text("Digite seu número de telefone: "),
    password: async () => await input.text("Digite sua senha (se houver): "),
    phoneCode: async () => await input.text("Digite o código recebido: "),
    onError: (err) => console.log(err),
  });

  console.log("Logado com sucesso!");
  console.log("Sessão salva:", client.session.save()); // Salve a sessão para não precisar logar toda vez

  client.addEventHandler(async (event) => {
    const message = event.message;
    if (message) {
      console.log(`Nova mensagem de ${message.chat.title || message.senderId}: ${message.text}`);
      // Aqui você pode filtrar, formatar e reenviar as mensagens para outro grupo
    }
  });
}

run();