const eloValue = {
    diamond: 1,
    master: 2,
    grandmaster: 3,
    challenger: 4
};


const testPlayers = [
    { username: "Jugador1", roles: ["top"], elo: "master" },
    { username: "Jugador2", roles: ["jg"], elo: "master" },
    { username: "Jugador3", roles: ["mid", "support"], elo: "master" },
    { username: "Jugador4", roles: ["adc"], elo: "master" },

    { username: "Jugador5", roles: ["top"], elo: "diamond" },
    { username: "Jugador6", roles: ["jg"], elo: "diamond" },
    { username: "Jugador7", roles: ["mid"], elo: "diamond" },
    { username: "Jugador8", roles: ["adc"], elo: "diamond" },
    { username: "Jugador9", roles: ["support"], elo: "diamond" },
    { username: "Jugador10", roles: ["support"], elo: "diamond" }
];
console.log(findMatch(testPlayers));

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


function findAssignment(players, rolesToAssign, selectedPlayers = [], index = 0) {// Función recursiva para encontrar una asignación de roles a jugadores

    // Caso base: ya asignamos los 10 jugadores
    if (index === rolesToAssign.length) {
        return selectedPlayers;
    }

    const role = rolesToAssign[index];// Obtenemos el rol actual a asignar

    const playersForRole = getPlayersForRole(players, role);// Obtenemos los jugadores que pueden jugar este rol

    for (const player of playersForRole) {// Iteramos sobre los jugadores que pueden jugar este rol

        // Si ya usamos este jugador, lo saltamos
        if (selectedPlayers.some(p => p.username === player.username)) {
            continue;
        }
        
        console.log("Probando:", player.username, "→", role);

        // Probamos asignarle este rol
        selectedPlayers.push({
            ...player,
            assignedRole: role
        });

        // Intentamos continuar con el siguiente puesto
        const result = findAssignment(
            players,
            rolesToAssign,
            selectedPlayers,
            index + 1
        );

        // Si encontramos una solución, la devolvemos
        if (result !== null) {
            return result;
        }
        console.log("Volviendo atrás:", player.username, "->", role);

        // No funcionó → deshacemos la última decisión (Aqui inicia el backtracking)
        selectedPlayers.pop();
    }

    // No encontramos ninguna asignación posible
    return null;
}



function validateTeam(team){// Verifica si un equipo tiene 5 roles unicos
    const roles = team.map(player => player.assignedRole);
    const uniqueRoles = new Set(roles);
    return uniqueRoles.size === 5; // Verifica si hay 5 roles unicos  
}

function createTeams(selectedPlayers) {

     const roles = ['top', 'jg', 'mid', 'adc', 'support'];

    const rolePlayers = roles.map(role => { // Filtra los jugadores seleccionados por rol

        return selectedPlayers.filter( 
            player => player.assignedRole === role
        );

    });
// Ahora tenemos un array de arrays, donde cada sub-array contiene los jugadores que pueden jugar ese rol
    let bestTeam1 = null;
    let bestTeam2 = null;
    let bestDifference = Infinity;

    // Hay 2 opciones por rol:
    // jugador 1 → equipo 1, jugador 2 → equipo 2
    // jugador 2 → equipo 1, jugador 1 → equipo 2
    // Por lo tanto, hay 2^5 = 32 combinaciones posibles
    for (let combination = 0; combination < 32; combination++) { // Itera sobre todas las combinaciones posibles de asignación de jugadores a equipos

        const team1 = [];
        const team2 = [];

        let team1Elo = 0;
        let team2Elo = 0;
// Itera sobre cada rol y asigna jugadores a equipos según la combinación actual
        for (let i = 0; i < roles.length; i++) {

            const player1 = rolePlayers[i][0];
            const player2 = rolePlayers[i][1];
// Esto quiere decir: "Según la combinación que estamos probando, ¿dejamos a estos dos jugadores como están o los intercambiamos?"
            if ((combination & (1 << i)) === 0) {

                team1.push(player1);
                team2.push(player2);

                team1Elo += eloValue[player1.elo];
                team2Elo += eloValue[player2.elo];

            } else {

                team1.push(player2);
                team2.push(player1);

                team1Elo += eloValue[player2.elo];
                team2Elo += eloValue[player1.elo];
            }
        }

        const difference = Math.abs(team1Elo - team2Elo);
        
//Guarda la mejor diferencia de elo y los equipos correspondientes
        if (difference < bestDifference) {

            bestDifference = difference;
            bestTeam1 = team1;
            bestTeam2 = team2;
        }
    }

    return {
        team1: bestTeam1,
        team2: bestTeam2
    };
}

function findMatch(players){ //Función principal para encontrar un match de 10 jugadores con roles asignados

    if (players.length < 10) {
        return null;
    }
    const roleCounts = getRoleCounts(players);//Contadores de candidatos por rol
    const roleOrder = getRoleOrder(roleCounts);//Orden de prioridad de roles
    const rolesToAssign = [];//Lista de roles a asignar

    for (const role of roleOrder) {//Agrega cada rol a la lista de roles a asignar, dos veces para formar dos equipos
    rolesToAssign.push(role);
    rolesToAssign.push(role);
    }

    const selectedPlayers = findAssignment(//Llamada a la función recursiva para encontrar una asignación de roles a jugadores
        players,
        rolesToAssign
    );

   if (selectedPlayers === null) {
    return null;
   }


 const teams = createTeams(selectedPlayers);

 console.log("Equipo 1 válido:", validateTeam(teams.team1));
 console.log("Equipo 2 válido:", validateTeam(teams.team2));

 console.log("EQUIPO 1:", teams.team1);
 console.log("EQUIPO 2:", teams.team2);
 console.log("TOTAL SELECCIONADOS:", selectedPlayers.length);

 return teams;
}
module.exports = {
    findMatch
};