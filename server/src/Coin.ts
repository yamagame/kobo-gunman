import { CHAR } from "Characters";

export class Coin {
  status: string;
  id: number;
  x: number;
  y: number;
  constructor({ id = 0, x = 0, y = 0 }) {
    this.status = "idle";
    this.id = id;
    this.x = x;
    this.y = y;
  }

  idle() {}

  get pictId() {
    return CHAR.COIN;
  }
}
