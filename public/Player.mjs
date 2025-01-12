import defaults from './defaults.mjs';

export class Player {
  constructor({x, y, score, id}) {
    this.x = x;
    this.y = y;
    this.score = score;
    this.id = id;
    this.rad = 30;
  }

  movePlayer(dir, speed) {
    switch(dir) {
      case 'up':
        this.y = Math.max(defaults.minY, this.y - speed);
        break;
      case 'down':
        this.y = Math.min(defaults.maxY - this.rad, this.y + speed);
        break;
      case 'left':
        this.x = Math.max(defaults.minX, this.x - speed);
        break;
      case 'right':
        this.x = Math.min(defaults.maxX - this.rad, this.x + speed);
        break;
    }
  }

  collision(item) {
    const dy = item.y - this.y;
    const dx = item.x - this.x;
    return (Math.sqrt(dy * dy + dx * dx) < this.rad);
  }

  calculateRank(arr) {
    let pos = arr.sort((a, b) => b.score - a.score)
      .findIndex(item => this.id === item.id) + 1;
    return `Rank: ${pos}/${arr.length}`;
  }
  
  draw(ctx, img) {
    ctx.drawImage(img, this.x, this.y, this.rad, this.rad);
  }
}

try {
  module.exports = Player;
} catch(e) {}

export default Player;
