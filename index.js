const tmi = require('tmi.js'); //Importando libreria tmi que es para interactuar directamente con el chat de twitch
const players = []; //Lista de jugadores
const validRoles = ['top','jg','jungla','mid','adc','supp','support','soporte','sup','toplaner','jungler','midlaner','adcarry','supporter'];
const validElos = ['chall','challenger','retador','grandmaster','gm','granmaestro','master','maestro','diamante','esmeralda','platino','oro','plata','bronce','hierro'];

console.log("Iniciando bot..."); // Un mensaje para indicar cuando inicio el bot

const client = new tmi.Client({ //Configuracion del cliente de tmi.
    identity: {
        username:"Lenzks",
        password: "oauth:x5k6wtnyl2xgcx50c4nopl2p8dcdxg"
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

const testPlayers = [
    {
        username: "Jugador1",
        roles: ["top"],
        elo: "master"
    },
    {
        username: "Jugador2",
        roles: ["jg"],
        elo: "master"
    },
    {
        username: "Jugador3",
        roles: ["mid"],
        elo: "master"
    },
    {
        username: "Jugador4",
        roles: ["adc"],
        elo: "master"
    },
    {
        username: "Jugador5",
        roles: ["support"],
        elo: "master"
    },
    {
        username: "Jugador6",
        roles: ["top"],
        elo: "diamond"
    },
    {
        username: "Jugador7",
        roles: ["jg"],
        elo: "diamond"
    },
    {
        username: "Jugador8",
        roles: ["mid"],
        elo: "diamond"
    },
    {
        username: "Jugador9",
        roles: ["adc"],
        elo: "diamond"
    },
    {
        username: "Jugador10",
        roles: ["support"],
        elo: "diamond"
    },
    {
    username: "Jugador11",
    roles: ["mid", "support"],
    elo: "master"
     }
];

function canPlayRole(player, role) { //Verifica si un jugador puede jugar un rol especifico
    return player.roles.includes(role);
}

function getPlayersForRole(players, role) { //Filtra los jugadores que pueden jugar un rol especifico
    return players.filter(player => canPlayRole(player, role));
}

function getRoleCounts(players){ //¿Cuantos candidatos hay para cada rol?
    const counts = { //contadores
        top: 0,
        jg: 0,
        mid: 0,
        adc: 0,
        support: 0
    };

    for (const player of players) {
        for (const role of player.roles) { //Mira todos los roles que puede jugar ese candidato
            if (counts[role] !== undefined) {
                counts[role]++;
            }
        }
    }

    return counts;
}

function getRoleOrder(roleCounts) { // Encuentra el rol mas escaso
    return Object.entries(roleCounts)
        .sort((a, b) => a[1] - b[1])
        .map(entry => entry[0]);
}
function selectPlayerForRole(players, role, selectedPlayers) { //Selecciona un jugador para un rol especifico, evitando jugadores ya seleccionados
   const playersForRole = getPlayersForRole(players, role);

    for (const player of playersForRole) {

        if (!selectedPlayers.includes(player)) {
            return player;
        }
    }

    return null;
}


function assignRole(player) {
    if (player.roles.length === 1) { //este jugador eligio un rol?
        return player.roles[0]; 
    }

    const randomIndex = Math.floor(Math.random() * player.roles.length);

    return player.roles[randomIndex];
}
function findMatch(players){

    if (players.length < 10) {
        return null;
    }

    if (!AllRolesValidation(players)) { //Verifica si hay al menos un jugador para cada rol
        return null;
    }

    const roleCounts = getRoleCounts(players);//Contadores de candidatos por rol
    const roleOrder = getRoleOrder(roleCounts);//Orden de prioridad de roles
    const selectedPlayers = []; //Lista vacia de jugadores seleccionados

    console.log("Disponibilidad por rol:", roleCounts);
    console.log("Orden de prioridad: ", roleOrder);

     for (const role of roleOrder) {
        for(let i = 0; i < 2; i++) { //Selecciona 2 jugadores por rol

         const player = selectPlayerForRole(
            players, 
            role,
            selectedPlayers
         );
        
         if (player === null) {
         return null;
         } 
        
         selectedPlayers.push(player);


         console.log("Rol:", role);
         console.log("Candidatos:", player);
        }
     console.log("Jugadores seleccionados:", selectedPlayers);
      
     
    }
    console.log("TOTAL SELECCIONADOS:", selectedPlayers.length);
    console.log("SELECCIONADOS:", selectedPlayers); 
    return selectedPlayers;

}



function AllRolesValidation(players){ //Verifica si hay al menos un jugador para cada rol
    const roles = ['top', 'jg', 'mid', 'adc', 'support'];

    for (const role of roles) {
        const playersForRole = getPlayersForRole(players, role);
        if (playersForRole.length === 0) {
            return false;
        }
    }
    return true;
}

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

    const match = findMatch(testPlayers);

    if (match === null) {
        client.say(
            channel,
            ` No hay suficientes candidatos. Hay ${players.length}/10.`
        );
        return;
    }

    const matchList = match.map(player => {
        return `${player.username} (${player.roles.join('/')} ${player.elo})`;
    });

    client.say(
        channel,
        ` Partida encontrada: ${matchList.join(', ')}`
    );

    console.log("MATCH:", match);
}
});