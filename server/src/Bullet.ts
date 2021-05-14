import { Player, PlayerDir } from "Player";

export class Bullet {
  status: string;
  id: number;
  x: number;
  y: number;
  dir: PlayerDir;
  idleCounter: number;
  constructor(player: Player) {
    this.status = "idle";
    this.id = player.id;
    this.x = player.x;
    this.y = player.y;
    this.dir = player.dir;
    this.idleCounter = 0;
  }

  idle() {
    this.idleCounter++;
    if (this.idleCounter >= 65536) this.idleCounter = 0;
    if (this.idleCounter % 2) {
      if (this.dir === PlayerDir.LEFT) {
        this.x--;
      } else {
        this.x++;
      }
    }
  }

  dead() {
    this.status = "dead";
  }

  get isDead() {
    return this.status === "dead";
  }
}
