Synced

Sistema de matchmaking para partidas personalizadas de League of Legends integrado con un bot de Twitch.

Synced permite que los jugadores se registren desde el chat de Twitch indicando sus roles y rango, para posteriormente formar partidas de 10 jugadores distribuidas en dos equipos de 5 con una composición válida de roles.

Características
Integración con Twitch mediante tmi.js.
Registro de jugadores mediante comandos del chat.
Sistema de cola de jugadores.
Comandos !join, !leave y !match.
Soporte para jugadores que pueden desempeñar hasta dos roles.
Selección automática de jugadores para completar las cinco posiciones:
Top
Jungle
Mid
ADC
Support
Algoritmo de búsqueda basado en backtracking para encontrar una combinación válida.
Distribución de los jugadores en dos equipos de 5.
Balance básico de equipos utilizando el rango de los jugadores.
API desarrollada con Express.
Interfaz web para visualizar la cola y los equipos generados.
Comunicación entre el bot, el backend y el frontend mediante una cola compartida en memoria.
Tecnologías
Node.js
JavaScript
Express
tmi.js
HTML
CSS
Git / GitHub
Arquitectura

El proyecto está dividido en varias partes:

Synced
│
├── app.js
├── bot.js
├── server.js
├── queue.js
├── matchmaking.js
│
├── public/
│   ├── index.html
│   └── style.css
│
├── package.json
├── package-lock.json
└── .gitignore
Bot de Twitch

bot.js se encarga de conectarse al chat de Twitch y procesar los comandos enviados por los jugadores.

Ejemplos:

!join mid master
!join mid support diamond
!leave
!match
Cola

queue.js contiene la lista de jugadores que están esperando una partida.

Cada jugador se representa con información como:

{
    username: "player",
    roles: ["mid", "support"],
    elo: "master"
}
Matchmaking

matchmaking.js contiene la lógica principal para construir las partidas.

El algoritmo debe encontrar una combinación de jugadores que permita cubrir las cinco posiciones en cada equipo.

Para resolver los casos donde existen jugadores con múltiples roles, se utiliza backtracking. El algoritmo prueba diferentes asignaciones y vuelve atrás cuando una combinación no puede completarse.

Una vez encontrados 10 jugadores válidos, se evalúan diferentes distribuciones para crear dos equipos con una diferencia de rango lo más pequeña posible.

API

server.js utiliza Express para proporcionar una API sencilla.

Endpoints principales:

GET  /
GET  /players
POST /match

El frontend utiliza estos endpoints para consultar la cola y solicitar una partida.

Flujo del proyecto
Jugador
   │
   ▼
Chat de Twitch
   │
   ▼
bot.js
   │
   ▼
queue.js
   │
   ▼
matchmaking.js
   │
   ├── Selección de jugadores
   ├── Asignación de roles
   ├── Validación de composición
   └── Balance de equipos
   │
   ▼
server.js
   │
   ▼
Frontend
Objetivo del proyecto

El proyecto fue desarrollado como una forma práctica de aprender y aplicar conceptos de desarrollo de software, incluyendo:

JavaScript con Node.js.
Desarrollo de APIs con Express.
Integración con servicios externos.
Manejo de estructuras de datos.
Algoritmos de búsqueda y backtracking.
Modularización del código.
Comunicación entre backend y frontend.
Uso de Git y GitHub.
Limitaciones actuales

Synced es actualmente un proyecto basado en memoria, por lo que la información de la cola se pierde cuando el servidor se reinicia.

Actualmente no cuenta con:

Base de datos.
Sistema de cuentas de usuario.
Historial de partidas.
MMR avanzado.
Sistema de autenticación propio.
Persistencia de jugadores.

Estas características podrían incorporarse en futuras versiones.

Ejecución local

Instalar las dependencias:

npm install

Configurar las credenciales de Twitch mediante variables de entorno.

Después ejecutar:

node app.js

El servidor estará disponible en:

http://localhost:3000
Estado

Proyecto funcional en versión MVP.

Desarrollado como proyecto personal para practicar desarrollo backend, algoritmos, integración con APIs y construcción de aplicaciones web.
