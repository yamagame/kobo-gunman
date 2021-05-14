import { Player, PlayerDir } from "Player";
import { Bullet } from "Bullet";
import { Coin } from "Coin";
import { Snake } from "Snake";
import { CHAR } from "Characters";
import { BG } from "BG";

interface SoundPlayer {
  sound: string;
  play: (mml: string, track: number) => void;
  stop: (track: number) => void;
}
const Sound: SoundPlayer = {
  sound: "",
  play: (mml) => {
    Sound.sound = mml;
  },
  stop: (track) => {
    Sound.sound = "";
  },
};

enum SE {
  start = "@0-0 o5 l16 v0 cd",
  move = "@0-0 o5 l16 v12 cd",
  shot = "@0-5 o8 l4 v12 c",
  dead = "@0-0 o5 l16 v12 gfdc",
  coin = "@0-0 o8 l4 v12 ab",
  broken = "@0-0 o3 l16 v12 abcrc",
}

enum ACTION {
  UP = "up",
  DOWN = "down",
  LEFT = "left",
  RIGHT = "right",
  FIRE = "fire",
  INFO = "info",
}

export type MODE = "train" | "game" | "maze";

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
  action: ACTION;
};

export class GameObject {
  pictId: number = 0;
  x: number = 0;
  y: number = 0;
  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }
}

export class Game {
  mode: MODE = "train";
  maxPlayer: number = 6;
  players: Player[] = [];
  bullets: Bullet[] = [];
  snakes: Snake[] = [];
  coins: Coin[] = [];
  bg: BG;
  mapSize = { width: 21, height: 21 };
  objects: GameObject[] = [];
  idleCounter: number = 0;
  time: number = 300;
  startTime: Date | null = null;

  constructor() {
    this.bg = new BG();
    this.reset();
  }

  putBG(x: number, y: number, pictId: number) {
    this.bg.putBG(x, y, pictId);
  }

  getBG(x: number, y: number) {
    if (this.mode !== "maze") {
      return CHAR.SPACE;
    }
    return this.bg.getBG(x, y);
  }

  get mapData() {
    if (this.mode !== "maze") {
      return [];
    }
    return this.bg.mapData;
  }

  releaseCoin = (player: Player) => {
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
  };

  idle() {
    if (this.mode === "maze") {
      this.bg.visible = true;
    } else {
      this.bg.visible = false;
    }
    this.idleCounter++;
    if (this.idleCounter >= 65536) this.idleCounter = 0;
    this.bullets.forEach((bullet) => {
      bullet.idle();
      if (bullet.x > this.mapSize.width - 1 || bullet.x < 0) {
        bullet.dead();
      } else if (this.getBG(bullet.x, bullet.y) !== CHAR.SPACE) {
        if (this.getBG(bullet.x, bullet.y) === CHAR.CACTUS) {
          this.putBG(bullet.x, bullet.y, CHAR.SPACE);
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
              this.releaseCoin(player);
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
    if (this.mode !== "train") {
      this.snakes.forEach((snake) => {
        if (snake.idle(this.bg)) {
          this.players.forEach((player) => {
            if (!player.isDead) {
              if (snake.x === player.x && snake.y === player.y) {
                player.dead();
                this.releaseCoin(player);
                player.coin = 0;
                Sound.play(SE.dead, 0);
              }
            }
          });
        }
      });
    }
    this.objects = [];
    if (this.mode !== "train") {
      this.coins.forEach((coin) => {
        const obj = new GameObject();
        obj.pictId = coin.pictId;
        obj.x = coin.x;
        obj.y = coin.y;
        this.objects.push(obj);
      });
    }
    if (this.mode !== "train") {
      this.snakes.forEach((snake) => {
        const obj = new GameObject();
        obj.pictId = snake.pictId;
        obj.x = snake.x;
        obj.y = snake.y;
        this.objects.push(obj);
      });
    }
    this.players.forEach((player) => {
      for (let i = 1; i < player.coin + 1; i++) {
        const history = [...player.history].reverse();
        if (history[i]) {
          const obj = new GameObject();
          obj.pictId = CHAR.COIN;
          obj.x = history[i].x;
          obj.y = history[i].y;
          this.objects.push(obj);
        }
      }
    });
    this.bullets.forEach((bullet) => {
      const obj = new GameObject();
      obj.pictId = CHAR.BULLET;
      obj.x = bullet.x;
      obj.y = bullet.y;
      this.objects.push(obj);
    });
    this.players.forEach((player) => {
      const obj = new GameObject();
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
          case ACTION.UP:
            if (y > 0) y--;
            Sound.play(SE.move, 0);
            break;
          case ACTION.DOWN:
            if (y < this.mapSize.height - 1) y++;
            Sound.play(SE.move, 0);
            break;
          case ACTION.LEFT:
            if (x > 0) x--;
            player.dir = PlayerDir.LEFT;
            Sound.play(SE.move, 0);
            break;
          case ACTION.RIGHT:
            if (x < this.mapSize.width - 1) x++;
            player.dir = PlayerDir.RIGHT;
            Sound.play(SE.move, 0);
            break;
          case ACTION.FIRE:
            if (!this.bullets.some((bullet) => bullet.id === player.id)) {
              this.bullets.push(new Bullet(player));
              Sound.play(SE.shot, 0);
            }
            break;
        }
      }
      if (
        this.getBG(x, y) === CHAR.SPACE &&
        (player.x !== x || player.y !== y)
      ) {
        player.x = x;
        player.y = y;
        player.move();
        if (this.mode !== "train") {
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
          this.snakes.forEach((snake) => {
            if (!player.isDead) {
              if (snake.x === player.x && snake.y === player.y) {
                player.dead();
                this.releaseCoin(player);
                player.coin = 0;
                Sound.play(SE.dead, 0);
              }
            }
          });
        }
      }
      return player;
    }
  }

  get sound() {
    return Sound.sound;
  }

  set sound(mml: string) {
    Sound.sound = mml;
  }

  reset(maxPlayer = 6) {
    this.maxPlayer = maxPlayer;
    this.players = [];
    for (let i = 0; i < this.maxPlayer; i++) {
      const player = new Player({ id: i, ...initialProps(this.mapSize) });
      this.players.push(player);
    }
    this.bg.initialMapData(this.mapSize);
    this.coins = [];
    for (let i = 0; i < 10; i++) {
      this.coins.push(new Coin(initialProps(this.mapSize)));
    }
    this.snakes = [];
    for (let i = 0; i < 5; i++) {
      this.snakes.push(new Snake(initialProps(this.mapSize)));
    }
  }
}
