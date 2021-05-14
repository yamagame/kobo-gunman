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

enum ACTION {
  UPDATE = "update",
  SOUND = "sound",
}

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
  return mapData;
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

export type GameControllMessage = {
  action: ACTION;
  mapData: BG[][];
  objects: GameObject[];
  sound: string;
  time: string;
};

export class Game {
  bgData: BG[][] = [];
  mapData: BG[][] = [];
  mapSize = { width: 21, height: 21 };
  objects: GameObject[] = [];
  time: string = "";

  constructor() {
    this.bgData = initialMapData(this.mapSize);
    this.mapData = initialMapData(this.mapSize);
  }

  control(message: GameControllMessage) {
    const { action } = message;
    if (action === ACTION.UPDATE) {
      const { mapData, objects, time } = message;
      this.objects = [...objects];
      this.mapData = mapData;
      this.time = time;
    }
    if (action === ACTION.SOUND) {
      const { sound } = message;
      Sound.play(sound, 0);
    }
  }

  startSound() {
    Sound.play(SE.start, 0);
  }
}
