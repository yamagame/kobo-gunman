import { CHAR } from "Characters";
import { BG } from "BG";

export enum SnakeDir {
  LEFT = -1,
  RIGHT = 1,
}

const rand = (length: number) => Math.floor(Math.random() * length);

export class Snake {
  status: string;
  id: number;
  x: number;
  y: number;
  counter: number;
  dir: SnakeDir = SnakeDir.LEFT;

  constructor({ id = 0, x = 0, y = 0 }) {
    this.status = "idle";
    this.id = id;
    this.x = x;
    this.y = y;
    this.counter = 0;
    if (rand(10) < 5) {
      this.dir = SnakeDir.RIGHT;
    }
  }

  idle(bg: BG) {
    this.counter++;
    if (this.counter > 20) {
      this.counter = 0;
      if (bg.getBG(this.x + this.dir, this.y) === CHAR.SPACE) {
        this.x += this.dir;
        return true;
      } else {
        this.dir = -this.dir;
      }
    }
    return false;
  }

  get pictId() {
    return CHAR.SNAKE;
  }
}
