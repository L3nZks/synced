const express = require('express');
const { players } = require('./queue');
const { findMatch } = require('./matchmaking');

const app = express();

app.use(express.static('public'));

const PORT = 3000;

app.get('/', (req, res) => {
    res.send('Synced API funcionando');
});

app.get('/players', (req, res) => {
    res.json(players);
}); 

app.post('/match', (req, res) => {

    const match = findMatch(players);

    if (match === null) {
        return res.status(400).json({
            message: 'No se pudo formar una partida',
            players: players.length
        });
    }

    players.length = 0;

    res.json(match);
});

app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});