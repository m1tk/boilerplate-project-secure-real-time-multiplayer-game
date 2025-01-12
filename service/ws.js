const { Collectible } = require('../public/Collectible.mjs');
const { Player } = require('../public/Player.mjs');
const { rand_coin, rand_start_position } = require('../public/defaults.mjs');

let players = [];
let coin_gen = rand_coin();
let coin = new Collectible({x: coin_gen[0], y: coin_gen[1], value: coin_gen[2], id: Date.now()});
let cons = [];

const setup_ws = (io) => {
    io.sockets.on('connection', sock => {
        let pos_gen = rand_start_position();
        let player  = new Player({x: pos_gen[0], y: pos_gen[1], score: 0, id: sock.id});
        
        for (let i = 0; i < cons.length; i++) {
            cons[i].emit("join", player);
        }

        players.push(player);
        cons.push(sock);

        sock.emit('start', {id: sock.id, players: players, coin: coin});

        sock.on('disconnect', () => {
            cons = cons.filter(con => con.id !== sock.id);
            players = players.filter(pl => pl.id !== sock.id);
            cons.forEach(s => {
                s.emit("left", sock.id);
            });
        });
        
        sock.on('movement', (new_pos) => {
            for (let i = 0; i < players.length; i++) {
                let collide = false;
                if (players[i].id === sock.id
                    && Number.isInteger(new_pos.x) && Number.isInteger(new_pos.y)) {
                    players[i].x = new_pos.x;
                    players[i].y = new_pos.y;
                    if (players[i].collision(coin)) {
                        players[i].score += coin.value;
                        coin_gen = rand_coin();
                        coin = new Collectible({
                            x: coin_gen[0],
                            y: coin_gen[1],
                            value: coin_gen[2],
                            id: Date.now()
                        });
                        collide = true;
                    }
                    cons.forEach(s => {
                        if (collide) {
                            s.emit("coin", coin);
                        }
                        if (s.id == players[i].id) {
                            s.emit("score", players[i].score);
                        } else {
                            s.emit("movement", players[i]);
                        }
                    });
                    break;
                }
            }
        });
    });
};

module.exports = setup_ws