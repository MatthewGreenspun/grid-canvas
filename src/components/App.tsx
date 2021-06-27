import { useState, useCallback, useEffect, useRef } from "react";
import Color from "./Color";

const generateRandomColor = () => {
  const posibilities = "0123456789abcdef";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += posibilities[Math.floor(Math.random() * 16)];
  }
  return color;
};

function App() {
  const [color, setColor] = useState("#0055ff");
  const [colors, setColors] = useState(new Set<string>());
  const [dimentions, setDimensions] = useState(16);
  const [mouseIsDown, setMouseIsDown] = useState(false);
  const [border, setBorder] = useState(true);
  const scaleCanvas = useCallback((canvas: HTMLCanvasElement) => {
    let dpi = window.devicePixelRatio;
    let style_height = +getComputedStyle(canvas)
      .getPropertyValue("height")
      .slice(0, -2);
    let style_width = +getComputedStyle(canvas)
      .getPropertyValue("width")
      .slice(0, -2);
    canvas.setAttribute("height", `${style_height * dpi}`);
    canvas.setAttribute("width", `${style_width * dpi}`);
  }, []);
  const generateGrid = useCallback(
    (random?: boolean, color?: string) => {
      const arr = [];
      for (let i = 0; i < dimentions ** 2; i++) {
        arr.push(random ? generateRandomColor() : color ? color : "#ffffff");
      }
      return arr;
    },
    [dimentions]
  );
  const [grid, setGrid] = useState(generateGrid(true));
  const gridRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setGrid(generateGrid(true));
  }, [dimentions, generateGrid]);

  useEffect(() => {
    const gridDiv = gridRef.current;
    gridDiv?.addEventListener("mousedown", (e) => {
      e.preventDefault();
      setMouseIsDown(true);
    });
    gridDiv?.addEventListener("mouseup", () => setMouseIsDown(false));
    return () => {
      gridDiv?.removeEventListener("mousedown", (e) => {
        e.preventDefault();
        setMouseIsDown(true);
      });
      gridDiv?.removeEventListener("mouseup", () => setMouseIsDown(false));
    };
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx && canvas) {
      scaleCanvas(canvas);

      const squareLength = canvas.width / dimentions;
      const rows = dimentions;
      const cols = dimentions;
      let row = 0;
      let col = 0;
      for (row = 0; row < rows; row++) {
        for (col = 0; col < cols; col++) {
          ctx.fillStyle = grid[rows * row + col];
          ctx.fillRect(
            col * squareLength,
            row * squareLength,
            squareLength,
            squareLength
          );
        }
      }
    }
  }, [dimentions, scaleCanvas, grid]);

  return (
    <div className="app">
      <canvas
        ref={canvasRef}
        height={dimentions}
        width={dimentions}
        style={{
          minWidth: "200px",
        }}
      />
      <div>
        <input
          type="color"
          value={color}
          onChange={(e) => {
            setColor(e.target.value);
          }}
          onBlur={(e) => {
            setColors((colorList) => {
              colorList.add(e.target.value);
              return new Set(colorList);
            });
          }}
        />
        {Array.from(colors).map((color) => (
          <Color
            key={color}
            color={color}
            onRemove={(color) =>
              setColors((colors) => {
                colors.delete(color);
                return new Set(colors);
              })
            }
            onClick={(color) => setColor(color)}
          />
        ))}
        <input
          type="range"
          min="1"
          max="100"
          value={dimentions}
          onChange={(e) => setDimensions(Number(e.target.value))}
        />
        <h5>
          {dimentions} x {dimentions}
        </h5>
        <input
          type="checkbox"
          checked={border}
          onChange={(e) => setBorder(e.target.checked)}
        />
        <button onClick={() => setGrid(generateGrid())}>Clear</button>
        <button onClick={() => setGrid(generateGrid(true))}>
          Random Colors
        </button>
        <button onClick={() => setGrid(generateGrid(false, color))}>
          Fill color
        </button>
      </div>
    </div>
  );
}

export default App;
