# Synced

### Sistema de matchmaking para League of Legends integrado con Twitch

Synced es un sistema de matchmaking que permite a los jugadores unirse a una cola desde el chat de Twitch y generar automáticamente partidas de 5 contra 5 teniendo en cuenta la disponibilidad de roles y el rango de los jugadores.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat\&logo=node.js\&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat\&logo=javascript\&logoColor=black)
![Express](https://img.shields.io/badge/Express-000000?style=flat\&logo=express\&logoColor=white)
![Twitch](https://img.shields.io/badge/Twitch-9146FF?style=flat\&logo=twitch\&logoColor=white)

---

## ¿Qué es Synced?

Synced conecta un bot de Twitch con una aplicación web para crear partidas personalizadas de League of Legends.

Los jugadores pueden entrar a la cola directamente desde el chat utilizando comandos como:

```text
!join mid master
!join support diamond
!join mid support challenger
```

Cuando existen suficientes jugadores, el sistema busca una combinación válida para formar dos equipos de cinco.

Un jugador puede seleccionar hasta dos roles, permitiendo que el algoritmo tenga mayor flexibilidad al momento de construir la partida.

---

## Funcionalidades

| Funcionalidad          | Descripción                                                            |
| ---------------------- | ---------------------------------------------------------------------- |
| Integración con Twitch | Los jugadores interactúan con el sistema desde el chat                 |
| Sistema de cola        | Permite entrar y salir de la cola                                      |
| Múltiples roles        | Cada jugador puede seleccionar hasta dos posiciones                    |
| Asignación automática  | El sistema asigna los roles según las necesidades de la partida        |
| Backtracking           | Explora diferentes combinaciones para encontrar una composición válida |
| Validación de equipos  | Comprueba que cada equipo tenga las cinco posiciones                   |
| Balance de equipos     | Compara los rangos de los jugadores al crear los equipos               |
| Interfaz web           | Permite visualizar la cola y los equipos generados                     |
| API REST               | Conecta la lógica del servidor con la interfaz web                     |

---

## ¿Cómo funciona?

El proyecto está dividido en varios módulos que trabajan conjuntamente:

```text
                              Twitch
                                |
                                v
                              bot.js
                                |
                                v
                             queue.js
                                |
                                v
                         matchmaking.js
                           /           \
                          /             \
                         v               v
                      Equipo 1       Equipo 2
                          \             /
                           \           /
                            +---------+
                                |
                                v
                            server.js
                                |
                                v
                             Frontend
```

### 1. Bot de Twitch

`bot.js` se encarga de conectarse al chat de Twitch mediante `tmi.js` y procesar los comandos enviados por los jugadores.

Entre los comandos disponibles se encuentran:

```text
!join
!leave
!match
```

### 2. Cola de jugadores

`queue.js` mantiene la lista de jugadores que están esperando una partida.

Cada jugador se almacena como un objeto:

```js
{
    username: "player",
    roles: ["mid", "support"],
    elo: "master"
}
```

### 3. Matchmaking

`matchmaking.js` contiene la lógica principal para seleccionar los jugadores y asignarles sus roles.

El sistema analiza qué jugadores pueden desempeñar cada posición y utiliza **backtracking** para probar diferentes combinaciones.

Por ejemplo, un jugador que puede jugar Mid y Support puede ser asignado inicialmente a Mid. Si continuar por ese camino impide completar correctamente la composición, el algoritmo vuelve atrás y prueba otra posibilidad.

Esto permite manejar situaciones en las que varios jugadores pueden ocupar la misma posición.

### 4. Validación

Antes de crear los equipos, el sistema comprueba que las posiciones necesarias estén cubiertas.

Cada equipo debe contener:

```text
Top
Jungle
Mid
ADC
Support
```

La validación evita generar composiciones con roles repetidos o posiciones sin cubrir.

### 5. Balance de equipos

Una vez seleccionados los diez jugadores, el sistema evalúa distintas formas de distribuirlos entre los dos equipos.

Para realizar un balance básico, cada rango tiene un valor:

```text
Diamond      = 1
Master       = 2
Grandmaster  = 3
Challenger   = 4
```

El sistema compara el valor total de ambos equipos y busca una distribución válida con la menor diferencia posible.

---

## Estructura del proyecto

```text
Synced/
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
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

### Responsabilidad de cada archivo

| Archivo          | Función                                               |
| ---------------- | ----------------------------------------------------- |
| `app.js`         | Inicia el bot y el servidor                           |
| `bot.js`         | Conexión con Twitch y procesamiento de comandos       |
| `queue.js`       | Almacena la cola de jugadores                         |
| `matchmaking.js` | Selección de jugadores, asignación de roles y balance |
| `server.js`      | API de Express y servidor de la aplicación web        |
| `public/`        | Interfaz del proyecto                                 |

---

## API

El servidor Express proporciona los siguientes endpoints:

| Método | Endpoint   | Descripción                                 |
| ------ | ---------- | ------------------------------------------- |
| `GET`  | `/`        | Comprueba que el servidor esté funcionando  |
| `GET`  | `/players` | Devuelve los jugadores que están en la cola |
| `POST` | `/match`   | Intenta generar una partida                 |

---

## Ejemplo del proceso

Un ejemplo sencillo del flujo sería:

```text
1. Los jugadores entran desde Twitch
                ↓
2. Se almacenan en la cola
                ↓
3. El sistema analiza los roles disponibles
                ↓
4. Se buscan 10 jugadores compatibles
                ↓
5. Se asignan las posiciones mediante backtracking
                ↓
6. Se valida la composición
                ↓
7. Se generan dos equipos
                ↓
8. Se comparan los rangos
                ↓
9. Se muestran los equipos en la interfaz
```

---

## Tecnologías utilizadas

* **Node.js** — ejecución del backend
* **JavaScript** — lógica de la aplicación
* **Express** — servidor y API REST
* **tmi.js** — integración con Twitch
* **HTML** — estructura de la interfaz
* **CSS** — estilos de la interfaz
* **Git / GitHub** — control de versiones

---

## Ejecución local

Instala las dependencias del proyecto:

```bash
npm install
```

Configura las credenciales de Twitch mediante variables de entorno.

Después ejecuta:

```bash
node app.js
```

La aplicación web estará disponible en:

```text
http://localhost:3000
```

Las credenciales no deben almacenarse directamente en el código fuente. El proyecto incluye un `.env.example` como referencia y `.env` se encuentra excluido mediante `.gitignore`.

---

## Lo que aprendí con este proyecto

Este proyecto fue desarrollado como una forma práctica de aplicar y entender conceptos de desarrollo de software.

Entre los principales conceptos trabajados están:

* Organización y modularización de una aplicación Node.js
* Desarrollo de una API REST con Express
* Integración con un servicio externo mediante Twitch
* Manejo de objetos y estructuras de datos
* Uso de arrays, `filter`, `map`, `sort` y `Set`
* Algoritmos de búsqueda
* Backtracking y recursividad
* Validación de datos
* Comunicación entre backend y frontend
* Uso de Git y GitHub

---

## Limitaciones actuales

La cola de jugadores se almacena únicamente en memoria. Esto significa que los jugadores desaparecen de la cola cuando el servidor se reinicia.

Actualmente el proyecto no incluye:

* Base de datos
* Cuentas de usuario
* Historial de partidas
* Estadísticas de jugadores
* Sistema avanzado de MMR
* Persistencia de datos

---

## Posibles mejoras

Entre las características que podrían incorporarse en futuras versiones están:

* Persistencia mediante una base de datos
* Historial de partidas
* Estadísticas de jugadores
* Sistema de MMR más avanzado
* Actualizaciones de la cola en tiempo real
* Autenticación de usuarios
* Mejoras en el algoritmo de matchmaking

---

## Estado del proyecto

**Versión:** MVP

Synced es un proyecto personal desarrollado para practicar integración con servicios externos, desarrollo backend, algoritmos de búsqueda y construcción de aplicaciones web.
