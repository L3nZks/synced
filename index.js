const tmi = require('tmi.js');

console.log("🚀 Iniciando bot...");

const client = new tmi.Client({
    identity: {
        username:"Lenzks",
        password: "oauth:4zagsni3ghs339sf9vk3ks1x2vy3bf"
    },
    channels:["Lenzks"] 
});
client.on('connected', (addr, port) => {
  console.log("✅ Conectado a Twitch en", addr, port);
});

client.on('disconnected', (reason) => {
  console.log("❌ Desconectado:", reason);
});

client.connect()
  .then(() => console.log("🔗 connect() ejecutado"))
  .catch(err => console.error("💥 Error conectando:", err));

client.on('message',(channel,tags,message,self) =>{ 
    if(self)return;
    if(message === '!meow'){
        client.say(channel,'woof');
    }
});