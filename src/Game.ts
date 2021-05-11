import { Player, PlayerDir } from "Player";
import { Bullet } from "Bullet";
import { Coin } from "Coin";
import { BG } from "Characters";

interface SoundPlayer {
  play: (mml: string, track: number) => void;
  stop: (track: number) => void;
}
const Sound: SoundPlayer = (window as any).SOUND;

enum SE {
  start = "@0-0 o5 l16 v0 cd",
  move = "@0-0 o5 l16 v12 cd",
  shot = "@0-5 o8 l4 v12 c",
  dead = "@0-0 o5 l16 v12 gfdc",
  coin = "@0-0 o8 l4 v12 ab",
  broken = "@0-0 o3 l16 v12 abcrc",
}

enum KEYCODE {
  UP = "up",
  DOWN = "down",
  LEFT = "left",
  RIGHT = "right",
  FIRE = "fire",
}

const makeMaze = (
  mapData: BG[][],
  mapSize: { width: number; height: number }
) => {
  const { width, height } = mapSize;
  for (let y = 2; y < height - 2; y += 2) {
    for (let x = 2; x < width - 2; x += 2) {
      if (mapData[y][x] === BG.ROCK) {
        const d = [-1, 1];
        const dd = [];
        for (let iy = 0; iy < 2; iy++) {
          if (mapData[y + d[iy]][x] !== BG.ROCK) {
            if (y !== 2 && d[iy] === -1) continue;
            dd.push([y + d[iy], x]);
          }
        }
        for (let ix = 0; ix < 2; ix++) {
          if (mapData[y][x + d[ix]] !== BG.ROCK) {
            dd.push([y, x + d[ix]]);
          }
        }
        if (dd.length > 0) {
          const id = Math.floor(Math.random() * dd.length);
          mapData[dd[id][0]][dd[id][1]] = BG.ROCK;
        }
      }
    }
  }
};

const initialMapData = (mapSize = { width: 21, height: 21 }) => {
  const mapData: BG[][] = [];
  const { width, height } = mapSize;
  for (let y = 0; y < height; y++) {
    const line = [];
    for (let x = 0; x < width; x++) {
      line.push(BG.SPACE);
    }
    mapData.push(line);
  }
  for (let y = 2; y < height - 2; y += 2) {
    for (let x = 2; x < width - 2; x += 2) {
      mapData[y][x] = BG.ROCK;
    }
  }
  for (let x = 0; x < width; x++) {
    mapData[0][x] = BG.ROCK;
    mapData[mapSize.height - 1][x] = BG.ROCK;
  }
  for (let y = 0; y < height; y++) {
    mapData[y][0] = BG.ROCK;
    mapData[y][mapSize.width - 1] = BG.ROCK;
  }
  // makeMaze(mapData, mapSize);
  for (let i = 0; i < 10; i++) {
    const pos = initialProps(mapSize);
    mapData[pos.y][pos.x] = BG.CACTUS;
  }
  return mapData;
};

const rand = (length: number) => Math.floor(Math.random() * length);
const initialProps = ({ width, height }: { width: number; height: number }) => {
  return {
    x: Math.floor(rand(width - 1) / 2) * 2 + 1,
    y: Math.floor(rand(height - 1) / 2) * 2 + 1,
    dir: rand(2) === 0 ? PlayerDir.LEFT : PlayerDir.RIGHT,
  };
};

export type GameControllMessage = {
  index: number;
  action: KEYCODE;
};

export class Object {
  pictId: number = 0;
  x: number = 0;
  y: number = 0;
  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }
}

export class Game {
  players: Player[] = [];
  bullets: Bullet[] = [];
  coins: Coin[] = [];
  mapData: BG[][] = [];
  mapSize = { width: 21, height: 21 };
  objects: Object[] = [];
  idleCounter: number = 0;
  constructor(maxPlayer = 5) {
    for (let i = 0; i < maxPlayer; i++) {
      const player = new Player({ id: i, ...initialProps(this.mapSize) });
      this.players.push(player);
    }
    this.mapData = initialMapData(this.mapSize);
    for (let i = 0; i < 10; i++) {
      this.coins.push(new Coin(initialProps(this.mapSize)));
    }
  }

  putBG(x: number, y: number, pictId: number) {
    this.mapData[y][x] = pictId;
    this.mapData = [...this.mapData];
  }

  getBG(x: number, y: number) {
    return this.mapData[y][x];
  }

  idle() {
    this.idleCounter++;
    if (this.idleCounter >= 65536) this.idleCounter = 0;
    this.bullets.forEach((bullet) => {
      bullet.idle();
      if (this.getBG(bullet.x, bullet.y) !== BG.SPACE) {
        if (this.getBG(bullet.x, bullet.y) === BG.CACTUS) {
          this.putBG(bullet.x, bullet.y, BG.SPACE);
          Sound.play(SE.broken, 0);
        }
        bullet.dead();
      }
    });
    this.players.forEach((player) => {
      player.idle();
      if (player.isRevival) {
        const t = { ...player, ...initialProps(this.mapSize) };
        player.x = t.x;
        player.y = t.y;
        player.dir = t.dir;
        player.revival();
      }
      if (!player.isDead) {
        this.bullets.forEach((bullet) => {
          if (bullet.id !== player.id) {
            if (bullet.x === player.x && bullet.y === player.y) {
              bullet.dead();
              player.dead();
              for (let i = 1; i <= player.coin; i++) {
                const history = [...player.history].reverse();
                if (history[i]) {
                  const coin = new Coin(history[i]);
                  this.coins.push(coin);
                } else {
                  const coin = new Coin(initialProps(this.mapSize));
                  this.coins.push(coin);
                }
              }
              player.coin = 0;
              Sound.play(SE.dead, 0);
            }
          }
        });
      }
    });
    const bullets: Bullet[] = [];
    this.bullets.forEach((bullet) => {
      if (!bullet.isDead) {
        bullets.push(bullet);
      }
    });
    this.bullets = bullets;
    this.objects = [];
    this.coins.forEach((coin) => {
      const obj = new Object();
      obj.pictId = coin.pictId;
      obj.x = coin.x;
      obj.y = coin.y;
      this.objects.push(obj);
    });
    this.players.forEach((player) => {
      for (let i = 1; i < player.coin + 1; i++) {
        const history = [...player.history].reverse();
        if (history[i]) {
          const obj = new Object();
          obj.pictId = BG.COIN;
          obj.x = history[i].x;
          obj.y = history[i].y;
          this.objects.push(obj);
        }
      }
    });
    this.bullets.forEach((bullet) => {
      const obj = new Object();
      obj.pictId = BG.BULLET;
      obj.x = bullet.x;
      obj.y = bullet.y;
      this.objects.push(obj);
    });
    this.players.forEach((player) => {
      const obj = new Object();
      obj.pictId = player.pictId;
      obj.x = player.x;
      obj.y = player.y;
      this.objects.push(obj);
    });
  }

  control(message: GameControllMessage) {
    const { index, action } = message;
    if (index >= 0 || index < this.players.length) {
      const player = this.players[index];
      let x = player.x;
      let y = player.y;
      if (!player.isDead) {
        switch (action) {
          case KEYCODE.UP:
            if (y > 0) y--;
            Sound.play(SE.move, 0);
            break;
          case KEYCODE.DOWN:
            if (y < this.mapSize.height - 1) y++;
            Sound.play(SE.move, 0);
            break;
          case KEYCODE.LEFT:
            if (x > 0) x--;
            player.dir = PlayerDir.LEFT;
            Sound.play(SE.move, 0);
            break;
          case KEYCODE.RIGHT:
            if (x < this.mapSize.width - 1) x++;
            player.dir = PlayerDir.RIGHT;
            Sound.play(SE.move, 0);
            break;
          case KEYCODE.FIRE:
            if (!this.bullets.some((bullet) => bullet.id === player.id)) {
              this.bullets.push(new Bullet(player));
              Sound.play(SE.shot, 0);
            }
            break;
        }
      }
      if (this.getBG(x, y) === BG.SPACE && (player.x !== x || player.y !== y)) {
        player.x = x;
        player.y = y;
        player.move();
        const coins: Coin[] = [];
        this.coins.forEach((coin) => {
          if (coin.x === player.x && coin.y === player.y) {
            player.coin++;
            Sound.play(SE.coin, 0);
          } else {
            coins.push(coin);
          }
        });
        this.coins = coins;
      }
    }
  }

  startSound() {
    Sound.play(SE.start, 0);
  }
}
