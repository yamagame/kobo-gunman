import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Game, GameControllMessage } from "Game";
import SockJS from "sockjs-client";

const game = new Game();

function ConnectSock() {
  let sock = new SockJS("/controller");
  let interval: NodeJS.Timeout;

  sock.onopen = function () {
    console.log("open");
    interval = setInterval(() => {
      sock.send(JSON.stringify({ type: "heatbeet" }));
    }, 3000);
  };

  sock.onmessage = function (e) {
    if (typeof e.data === "string") {
      if (e.data === "ok") return;
    }
    const message = JSON.parse(e.data);
    game.control(message as GameControllMessage);
  };

  sock.onerror = function () {
    console.log("error");
  };

  sock.onclose = function () {
    clearInterval(interval);
    console.log("close");
    setTimeout(() => {
      ConnectSock();
    }, 3000);
  };
}
ConnectSock();

ReactDOM.render(
  <React.StrictMode>
    <App game={game} />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
