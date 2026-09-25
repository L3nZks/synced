const tmi = require('tmi.js'); //Importando libreria tmi que es para interactuar directamente con el chat de twitch
const { players } = require('./queue'); //Lista de jugadores
const validRoles = ['top','jg','jungla','mid','adc','supp','support','soporte','sup','toplaner','jungler','midlaner','adcarry','supporter'];
const validElos = ['chall','challenger','retador','grandmaster','gm','granmaestro','master','maestro','diamante','esmeralda','platino','oro','plata','bronce','hierro'];
const { findMatch } = require('./matchmaking');
require('dotenv').config();

console.log("Iniciando bot..."); // Un mensaje para indicar cuando inicio el bot

const client = new tmi.Client({ //Configuracion del cliente de tmi.
    identity: {
        username: process.env.TWITCH_USERNAME,
        password: process.env.TWITCH_TOKEN
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
    if(message.toLowerCase().startsWith ('!join')){ //Si el mensaje empieza con !  join  
      const parts = message.trim().split(/\s+/);

        if (parts.length !== 3) {
          client.say(
          channel,
         `${tags.username}, úsalo así: !join Mid Challenger o !join Mid/Support Challenger`
    );
    return;
  }
      
      
      const roles = parts[1].toLowerCase().split('/');
    
      const elo = parts[2].toLowerCase();

      if (roles.length > 2) {
        client.say(
         channel,
         `${tags.username}, puedes elegir máximo 2 roles.`
        );
      return;
  }

      if (new Set(roles).size !== roles.length) { // No permitir roles repetidos
        client.say(
         channel,
         `${tags.username}, no puedes repetir el mismo rol.`
        );
      return;
     }

     const invalidRole = roles.find( 
      role => !validRoles.includes(role) 
    ); 

    if (invalidRole) { 
      client.say( 
        channel, 
        `${tags.username}, el rol "${invalidRole}" no es válido. Usa: Top, Jg, Mid, Adc o Supp.` 
       );
       return;
       }

      if (!validElos.includes(elo)){
        client.say(
          channel,
          `${tags.username} , El elo "${elo}" no es valido , usa: Chall, Gm, Master, o los demas elos en español sin abreviaciones. `
        )
        return;
      }
 
      const alreadyJoined = players.some( //“¿Existe algún jugador cuyo nombre sea igual al usuario que escribió?”
        player => player.username === tags.username
      );
      if (alreadyJoined){
        client.say(
          channel,
          `${tags.username}, Ya estas en q`
        );
        return;
      }
      const player = {
        username: tags.username,
        roles: roles,
        elo: elo
      };

        players.push(player);
        client.say(
          channel, 
          `${tags.username} se unió como: ${roles} ${elo}. Total: ${players.length}`
        );

        console.log(players);
    }

    if(message ==='!queue'){
        if (players.length === 0) {
        client.say(channel, 'La cola está vacía.');
        return;
      }

       const queueList = players.map(player => {
       return `${player.username} (${player.roles.join('/')} ${player.elo})`;
       });

       client.say(
           channel,
            `Cola (${players.length}): ${queueList.join(', ')}`
           );
    }

    if(message ==='!leave'){
       const index = players.findIndex(
    player => player.username === tags.username
     );

      if (index === -1) {
        client.say(
         channel,
         `${tags.username}, no estás en la cola.`
         );
      return;
      }

     players.splice(index, 1);

     client.say(
       channel,
       `${tags.username} , saliste de la cola.`
     );

  console.log(players);
  }

  if (message === '!match') {

    const match = findMatch(players);

    if (match === null) {
        client.say(
            channel,
            `No se pudo formar una partida. Hay ${players.length}/10 jugadores.`
        );
        return;
    }

    client.say(channel, '¡Partida encontrada!');

    client.say(channel, '🔵 EQUIPO 1');

    for (const player of match.team1) {
        client.say(
            channel,
            `${player.assignedRole}: ${player.username} (${player.elo})`
        );
    }

    client.say(channel, '🔴 EQUIPO 2');

    for (const player of match.team2) {
        client.say(
            channel,
            `${player.assignedRole}: ${player.username} (${player.elo})`
        );
    }

    players.length = 0;

    console.log("MATCH:", match);
}
});