import { CHAR } from "Characters";
import { PlayerDir } from "Player";

const rand = (length: number) => Math.floor(Math.random() * length);

const initialProps = ({ width, height }: { width: number; height: number }) => {
  return {
    x: Math.floor(rand(width - 1) / 2) * 2 + 1,
    y: Math.floor(rand(height - 1) / 2) * 2 + 1,
    dir: rand(2) === 0 ? PlayerDir.LEFT : PlayerDir.RIGHT,
  };
};

export class BG {
  mapData: CHAR[][] = [];
  visible: boolean = false;

  putBG(x: number, y: number, pictId: number) {
    if (y >= 0 && y < this.mapData.length) {
      if (x >= 0 && x < this.mapData[y].length) {
        this.mapData[y][x] = pictId;
        this.mapData = [...this.mapData];
      }
    }
  }

  getBG(x: number, y: number) {
    if (y >= 0 && y < this.mapData.length) {
      if (x >= 0 && x < this.mapData[y].length) {
        if (this.visible) {
          return this.mapData[y][x];
        }
        return CHAR.SPACE;
      }
    }
    return CHAR.ROCK;
  }

  makeMaze = (
    mapData: CHAR[][],
    mapSize: { width: number; height: number }
  ) => {
    const { width, height } = mapSize;
    for (let y = 2; y < height - 2; y += 2) {
      for (let x = 2; x < width - 2; x += 2) {
        if (mapData[y][x] === CHAR.ROCK) {
          const d = [-1, 1];
          const dd = [];
          for (let iy = 0; iy < 2; iy++) {
            if (mapData[y + d[iy]][x] !== CHAR.ROCK) {
              if (y !== 2 && d[iy] === -1) continue;
              dd.push([y + d[iy], x]);
            }
          }
          for (let ix = 0; ix < 2; ix++) {
            if (mapData[y][x + d[ix]] !== CHAR.ROCK) {
              dd.push([y, x + d[ix]]);
            }
          }
          if (dd.length > 0) {
            const id = Math.floor(Math.random() * dd.length);
            mapData[dd[id][0]][dd[id][1]] = CHAR.CACTUS;
          }
        }
      }
    }
  };

  initialMapData = (mapSize = { width: 21, height: 21 }) => {
    const mapData: CHAR[][] = [];
    const { width, height } = mapSize;
    for (let y = 0; y < height; y++) {
      const line = [];
      for (let x = 0; x < width; x++) {
        line.push(CHAR.SPACE);
      }
      mapData.push(line);
    }
    for (let y = 2; y < height - 2; y += 2) {
      for (let x = 2; x < width - 2; x += 2) {
        mapData[y][x] = CHAR.ROCK;
      }
    }
    for (let x = 0; x < width; x++) {
      mapData[0][x] = CHAR.ROCK;
      mapData[mapSize.height - 1][x] = CHAR.ROCK;
    }
    for (let y = 0; y < height; y++) {
      mapData[y][0] = CHAR.ROCK;
      mapData[y][mapSize.width - 1] = CHAR.ROCK;
    }
    this.makeMaze(mapData, mapSize);
    for (let i = 0; i < 10; i++) {
      const pos = initialProps(mapSize);
      mapData[pos.y][pos.x] = CHAR.CACTUS;
    }
    this.mapData = mapData;
  };
}
