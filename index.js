require("dotenv").config();
const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const instanceId = process.env.ZAPI_INSTANCE_ID;
const token = process.env.ZAPI_TOKEN;

const sendMessage = async (phone, message) => {
    const url = `https://api.z-api.io/instances/${instanceId}/token/${token}/send-message`;
    await axios.post(url, {
        phone: phone,
        message: message,
    });
};

// Webhook que será chamado pela Z-API ao receber mensagens
app.post("/webhook", async (req, res) => {
    const body = req.body;
    const message = body.message?.body?.toLowerCase();
    const phone = body.message?.from;

    if (!message || !phone) return res.sendStatus(200);

    let reply = "";

    switch (message) {
        case "oi":
        case "olá":
            reply = `Seja bem-vindo ao *Hotzilla*! 🍣🔥\nDigite:\n1 – Fazer pedido\n2 – Ver cardápio\n3 – Promoções`;
            break;
        case "1":
            reply = `Me envie seu nome, sabor desejado e bairro para calcular a entrega.`;
            break;
        case "2":
            reply = `*Cardápio:*\n- Hot Clássico – R$18\n- Hot Bacon – R$20\n- Hot Apimentado – R$19\n- ComboZilla (8 unid + refri) – R$30`;
            break;
        case "3":
            reply = `🔥 Promoção de hoje:\n2 Hot por R$30\nPagando no Pix, leva refrigerante!`;
            break;
        default:
            reply = `Digite:\n1 – Fazer pedido\n2 – Ver cardápio\n3 – Promoções`;
    }

    await sendMessage(phone, reply);
    res.sendStatus(200);
});

// Porta padrão
app.listen(3000, () => {
    console.log("Hotzilla Bot rodando na porta 3000");
});
