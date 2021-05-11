import React from "react";
import "./App.css";
import Pict from "Pict";
import { BG } from "Characters";
import { Game, Object } from "Game";

type AppProps = {
  game: Game;
};

function App(props: AppProps) {
  const offsetX = (document.body.clientWidth - 21 * 32) / 2;
  const offsetY = (document.documentElement.clientHeight - 21 * 32) / 2;

  const { game } = props;
  const { mapData } = game;
  const [objects, setObjects] = React.useState([] as Object[]);
  const [step, setStep] = React.useState("title");

  React.useEffect(() => {
    const idletimer = setInterval(() => {
      game.idle();
      setObjects(game.objects);
    }, 100);
    return () => {
      clearInterval(idletimer);
    };
  }, [game]);

  React.useEffect(() => {
    const onKeyDown = function (e: KeyboardEvent) {
      switch (e.code) {
        case "Space":
          setStep("play");
          game.startSound();
          break;
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const getFontStyle = ({
    color,
    size,
    y,
  }: {
    color: string;
    size: number;
    y: number;
  }) => {
    return { color, fontSize: size, paddingTop: y };
  };

  return (
    <div>
      {step === "title" && (
        <div
          className="title"
          style={{
            width: 21 * 32,
            height: 21 * 32,
            top: offsetY,
            left: offsetX,
          }}
        >
          <div style={getFontStyle({ color: "orange", size: 96, y: 200 })}>
            GUNMAN
          </div>
          <div
            className="blink"
            style={getFontStyle({ color: "white", size: 32, y: 50 })}
          >
            PUSH SPACE KEY
          </div>
        </div>
      )}
      {step === "play" && (
        <>
          {mapData.map((line, y) => {
            return line.map((ch, x) => (
              <Pict key={`${x}-${y}`} pictId={BG.GROUND} x={x} y={y} />
            ));
          })}
          {mapData.map((line, y) => {
            return line.map((ch, x) => (
              <Pict key={`${x}-${y}`} pictId={ch} x={x} y={y} />
            ));
          })}
          {objects.map((obj, i) => {
            return <Pict key={i} pictId={obj.pictId} x={obj.x} y={obj.y} />;
          })}
        </>
      )}
    </div>
  );
}

export default App;
