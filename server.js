const express = require("express");
const app = express();
const port = 4000;
const sockjs = require("sockjs");
const { EventEmitter } = require("events");
const event = new EventEmitter();
const uuidv4 = require("uuid/v4");

const echo = sockjs.createServer({ prefix: "/controller" });
const broadcast = {};
echo.on("connection", function (conn) {
  broadcast[conn.id] = conn;
  conn.on("data", function (message) {
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

app.post("/player/:index/:action", (req, res) => {
  const { action, index } = req.params;
  const uuid = uuidv4();
  const onReceiveData = (data) => {
    if (data.uuid === uuid) {
      res.send(data);
      event.removeListener("data", onReceiveData);
    }
  };
  event.addListener("data", onReceiveData);
  for (const id in broadcast) {
    broadcast[id].write(JSON.stringify({ action, index, uuid }));
  }
});

const server = require("http").Server(app);
echo.installHandlers(server, { prefix: "/controller" });
server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
