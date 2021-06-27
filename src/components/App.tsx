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
  const [grid, setGrid] = useState(generateGrid);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setGrid(generateGrid());
    if (dimentions > 40) setBorder(false);
    else setBorder(true);
  }, [dimentions, generateGrid, scaleCanvas]);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas?.addEventListener("mousedown", (e) => {
      e.preventDefault();
      setMouseIsDown(true);
    });
    canvas?.addEventListener("mouseup", () => setMouseIsDown(false));
    return () => {
      canvas?.removeEventListener("mousedown", (e) => {
        e.preventDefault();
        setMouseIsDown(true);
      });
      canvas?.removeEventListener("mouseup", () => setMouseIsDown(false));
    };
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    console.log(border);
    if (ctx && canvas) {
      scaleCanvas(canvas);

      const squareLength = Math.round(canvas.width / dimentions);
      const rows = dimentions;
      const cols = dimentions;
      let row = 0;
      let col = 0;
      ctx.strokeStyle = "black";
      ctx.lineWidth = 3;
      for (row = 0; row < rows; row++) {
        for (col = 0; col < cols; col++) {
          const squareX = col * squareLength;
          const squareY = row * squareLength;
          if (border) {
            ctx.beginPath();
            ctx.moveTo(squareX, squareY);
            ctx.lineTo(squareX + squareLength, squareY);
            ctx.moveTo(squareX, squareY);
            ctx.lineTo(squareX, squareY + squareLength);
            ctx.stroke();
          }
          ctx.fillStyle = grid[rows * row + col];
          ctx.fillRect(squareX, squareY, squareLength, squareLength);
        }
      }
    }
  }, [dimentions, scaleCanvas, grid, border]);

  return (
    <div className="app">
      <canvas
        ref={canvasRef}
        height={dimentions}
        width={dimentions}
        style={{
          border: "1px solid black",
          minWidth: "200px",
        }}
        onClick={({ clientX, clientY, currentTarget }) => {
          setGrid((grid) => {
            const squareLength = currentTarget.width / dimentions;
            const row = Math.floor(clientY / squareLength);
            const col = Math.floor(clientX / squareLength);
            const idx = row * dimentions + col;
            grid[idx] = color;
            return [...grid];
          });
        }}
        onMouseMove={({ clientX, clientY, currentTarget }) => {
          if (mouseIsDown) {
            setGrid((grid) => {
              const squareLength = currentTarget.width / dimentions;
              const row = Math.floor(clientY / squareLength);
              const col = Math.floor(clientX / squareLength);
              const idx = row * dimentions + col;
              grid[idx] = color;
              return [...grid];
            });
          }
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
