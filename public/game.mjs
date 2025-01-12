import Player from './Player.mjs';
import Collectible from './Collectible.mjs';
import defaults from './defaults.mjs';

const socket = io();
const canvas = document.getElementById('game-window');
const context = canvas.getContext('2d');

let pl     = new Image();
let other  = new Image();
let gold_coin = new Image();
let silv_coin = new Image();
let brnz_coin = new Image();

pl.src    = "public/img/main-player.png";
other.src = "public/img/other-player.png";
gold_coin.src = "public/img/gold-coin.png";
silv_coin.src = "public/img/silver-coin.png";
brnz_coin.src = "public/img/bronze-coin.png";

let player;
let coino;
let coin_img;
let playersArr;

socket.on('start', ({id, players, coin}) => {
    player = new Player(players.filter(p => p.id === id)[0]);
    coino = new Collectible(coin);
    playersArr = players.map(pl => new Player(pl));

    document.onkeydown = e => {
        let dir;
        switch (e.keyCode) {
            case 87:
            case 38:
                dir = 'up';
                break;
            case 83:
            case 40:
                dir = 'down';
                break;
            case 65:
            case 37:
                dir = 'left';
                break;
            case 68:
            case 39:
                dir = 'right';
                break;
        }
        if (dir) {
            player.movePlayer(dir, 30);
            socket.emit("movement", {x: player.x, y: player.y});
        }
    }

    window.requestAnimationFrame(draw);
});

socket.on("coin", (coin) => {
    coino = new Collectible(coin);
});

socket.on("join", (player) => {
    playersArr.push(new Player(player));
});

socket.on("left", (id) => {
    playersArr = playersArr.filter(p => {
        p.id !== id
    });
});

socket.on("score", (score) => {
    player.score = score;
    for (let i = 0; i < playersArr.length; i++) {
        if (playersArr[i].id === player.id) {
            playersArr[i].score = player.score;
            break;
        }
    }
});

socket.on("movement", (ply) => {
    for (let i = 0; i < playersArr.length; i++) {
        playersArr[i].x = ply.x;
        playersArr[i].y = ply.y;
        playersArr[i].score = ply.score;
    }
});

const draw = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#222200';
    context.fillRect(0, 0, canvas.width, canvas.height);
    // borders
    context.strokeStyle = '#ffffff';
    context.strokeRect(defaults.minX, defaults.minY, defaults.areaW, defaults.areaH);
    
    // Text on top of area
    context.fillStyle = '#ffffff';
    context.font = `12px 'Press Start 2P'`;
    context.textAlign = 'center';
    context.fillText('Controls: WASD', 110, 40);
    
    context.font = `14px 'Press Start 2P'`;
    context.textAlign = 'center';
    context.fillText('Coin Race', 320, 40);

    context.textAlign = 'center';
    context.fillText(player.calculateRank(playersArr), 560, 40);
    
    // Drawing players and coin
    player.draw(context, pl);

    playersArr.forEach(pl => {
        if (pl.id !== player.id) {
            pl.draw(context, other);
        }
    });
    
    switch(coino.value) {
        case 3:
            coin_img = gold_coin;
            break;
        case 2:
            coin_img = silv_coin;
            break;
        case 1:
            coin_img = brnz_coin;
            break;
    }
    
    coino.draw(context, coin_img);
    
    requestAnimationFrame(draw);
};