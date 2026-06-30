const tmi = require('tmi.js'); //Importando libreria tmi que es para interactuar directamente con el chat de twitch
const players = []; //Lista de jugadores
console.log("Iniciando bot..."); // Un mensaje para indicar cuando inicio el bot

const client = new tmi.Client({ //Configuracion del cliente de tmi.
    identity: {
        username:"Lenzks",
        password: "oauth:4zagsni3ghs339sf9vk3ks1x2vy3bf"
    },
    channels:["Lenzks"] 
});
client.on('connected', (addr, port) => { //Conexion con el cliente, cuando se ejecute el bot se conectara al chat de twitch.
  console.log("✅ Conectado a Twitch en", addr, port);
});

client.on('disconnected', (reason) => { //Desconexion y muestra el motivo de la desconexion.
  console.log("❌ Desconectado:", reason);
});

client.connect() //Conexion y mensaje de error
  .then(() => console.log("🔗 connect() ejecutado"))
  .catch(err => console.error("💥 Error conectando:", err));

client.on('message',(channel,tags,message,self) =>{ //El metodo .on para ejecutar el codigo en base al mensaje
    if(self)return;
    if(message === '!join'){      
       
      if (players.includes(tags.username)){ //Prohibir repeticion.
        client.say(channel, `${tags.username}. ya está en cola.`);
        return;
      }
        players.push(tags.username);
        client.say(
          channel, `${tags.username} se ha unido a la cola. Total: ${players.length}`
        );
    }

    if(message ==='!queue'){
      client.say(
        channel, `Jugadores: ${players.join(', ')}` //Con join agarro todos los jugadores y los muestro separados por comas.
      );
    }

    if(message ==='!leave'){
      const index = players.indexOf(tags.username);
      if (index === -1) { //valida si ese jugador esta en la lista.
        client.say(channel,`${tags.username} no esta en la cola.`);
        return;
      }
      players.splice(index,1); //Elimina al jugador de la lista.
      client.say(
        channel, `${tags.username} salió de la cola.`
      );
    }
});