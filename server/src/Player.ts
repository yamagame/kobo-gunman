import { CHAR } from "Characters";
import { GameObject } from "Game";

export enum PlayerDir {
  LEFT = "LEFT",
  RIGHT = "RIGHT",
}

type PlayerInitialProps = {
  id: number;
  x: number;
  y: number;
  dir: PlayerDir;
};

export class Player {
  deadTimer: number;
  id: number;
  x: number;
  y: number;
  dir: PlayerDir;
  idleCounter: number;
  history: GameObject[] = [];
  coin: number;
  constructor({
    id = 0,
    x = 0,
    y = 0,
    dir = PlayerDir.LEFT,
  }: PlayerInitialProps) {
    this.deadTimer = 0;
    this.id = id;
    this.x = x;
    this.y = y;
    this.dir = dir;
    this.idleCounter = 0;
    this.coin = 0;
  }

  idle() {
    this.idleCounter++;
    if (this.idleCounter >= 65536) this.idleCounter = 0;
    if (this.deadTimer > 1) {
      this.deadTimer--;
    }
  }

  get dirOffset() {
    if (this.dir === PlayerDir.LEFT) return 0;
    return 2;
  }

  get pictId() {
    if (this.isDead) return CHAR.CROSS;
    return CHAR.PLAYER + this.dirOffset + ((this.idleCounter / 5) % 2);
  }

  dead() {
    this.deadTimer = 30;
  }

  get isDead() {
    return this.deadTimer > 0;
  }

  revival() {
    this.deadTimer = 0;
    this.history = [];
  }

  get isRevival() {
    return this.deadTimer === 1;
  }

  move() {
    this.history.push(new GameObject(this.x, this.y));
    this.history = this.history.slice(-30);
  }

  get info() {
    return {
      x: this.x,
      y: this.y,
      dir: this.dir,
      coin: this.coin,
      dead: this.isDead,
    };
  }
}
