import * as SockJS from "sockjs";
import { Game, GameControllMessage } from "Game";

const game = new Game();

const express = require("express");
const sockjs = require("sockjs");
const app = express();
const port = process.env.PORT || 4000;
const { EventEmitter } = require("events");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ type: "application/json" }));

function main() {
  const event = new EventEmitter();

  const echo = sockjs.createServer({ prefix: "/controller" });
  const broadcast: { [index: string]: SockJS.Connection } = {};

  let prevGameJSON = "";

  setInterval(() => {
    const now = new Date();
    const time = () => {
      if (game.mode === "train") return "";
      let time = game.time;
      if (game.startTime !== null) {
        time =
          game.time -
          Math.floor((now.getTime() - game.startTime.getTime()) / 1000);
      }
      return time > 0 ? `TIME:${time}` : "TIMEUP!";
    };
    game.idle();
    const gameJSON = JSON.stringify({
      action: "update",
      objects: game.objects,
      mapData: game.mapData,
      time: time(),
    });
    if (prevGameJSON !== gameJSON) {
      for (const id in broadcast) {
        broadcast[id].write(gameJSON);
      }
      prevGameJSON = gameJSON;
    }
    if (game.sound !== "") {
      const soundJSON = JSON.stringify({
        action: "sound",
        sound: game.sound,
      });
      for (const id in broadcast) {
        broadcast[id].write(soundJSON);
      }
      game.sound = "";
    }
  }, 100);

  echo.on("connection", function (conn) {
    broadcast[conn.id] = conn;
    conn.on("data", function (message: string) {
      const data = JSON.parse(message);
      if (data.type === "heatbeet") {
        conn.write("ok");
        return;
      }
      event.emit("data", data);
    });
    conn.on("close", function () {
      delete broadcast[conn.id];
    });
  });

  app.post("/reset/:playerNum?", (req, res) => {
    game.reset(req.params.playerNum);
    res.sendStatus(200);
  });

  app.post("/start/:time?", (req, res) => {
    const { time } = req.params;
    if (time) game.time = time;
    game.startTime = new Date();
    res.sendStatus(200);
  });

  app.post("/stop", (req, res) => {
    game.startTime = null;
    res.sendStatus(200);
  });

  app.post("/mode/:mode", (req, res) => {
    const { mode } = req.params;
    game.mode = mode;
    res.sendStatus(200);
  });

  app.post("/game", (req, res) => {
    const { action, index } = req.body;
    const player = game.control({ action, index } as GameControllMessage);
    res.send(player.info);
  });

  app.post("/player/:index", (req, res) => {
    const { index } = req.params;
    if (index >= 0 && index < game.maxPlayer) {
      const player = game.control({
        action: "info",
        index,
      } as GameControllMessage);
      return res.send(player.info);
    }
    res.sendStatus(404);
  });

  app.post("/player/:index/:action", (req, res) => {
    const { action, index } = req.params;
    const player = game.control({ action, index } as GameControllMessage);
    res.send(player.info);
  });

  const server = require("http").Server(app);
  echo.installHandlers(server, { prefix: "/controller" });
  server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
}

main();
