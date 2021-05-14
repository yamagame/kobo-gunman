import React from "react";
import "./App.css";
import Pict from "Pict";
import { BG } from "Characters";
import { Game } from "Game";

type ViewProps = {
  className?: string;
  offsetY: number;
  offsetX: number;
};
const View: React.FC<ViewProps> = ({
  className,
  children,
  offsetY,
  offsetX,
}) => {
  return (
    <div
      className={className}
      style={{
        width: 21 * 32,
        height: 21 * 32,
        top: offsetY,
        left: offsetX,
      }}
    >
      {children}
    </div>
  );
};

type AppProps = {
  game: Game;
};

function App(props: AppProps) {
  const offsetX = (document.body.clientWidth - 21 * 32) / 2;
  const offsetY = (document.documentElement.clientHeight - 21 * 32) / 2;

  const { game } = props;
  const { bgData, mapData, objects, time } = game;
  const [step, setStep] = React.useState("title");
  const [counter, setCounter] = React.useState(0);

  React.useEffect(() => {
    setInterval(() => {
      setCounter((s) => s + 1);
    }, 100);
  }, []);

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
  }, [game]);

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
        <View className="title" offsetX={offsetX} offsetY={offsetY}>
          <div style={getFontStyle({ color: "orange", size: 96, y: 200 })}>
            GUNMAN
          </div>
          <div
            className="blink"
            style={getFontStyle({ color: "white", size: 32, y: 50 })}
          >
            PUSH SPACE KEY
          </div>
        </View>
      )}
      {step === "play" && (
        <>
          {bgData.map((line, y) => {
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
          <View className="time" offsetX={offsetX} offsetY={offsetY - 52}>
            <div style={getFontStyle({ color: "white", size: 48, y: 0 })}>
              {time}
            </div>
          </View>
        </>
      )}
    </div>
  );
}

export default App;
