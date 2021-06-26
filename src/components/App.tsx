import React, { useState, useCallback } from "react";
import { useEffect } from "react";
import Square from "./Square";
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
  const generateGrid = useCallback(
    (random?: boolean, color?: string) => {
      const arr = [];
      for (let i = 0; i < dimentions ** 2; i++)
        arr.push(random ? generateRandomColor() : color ? color : "#ffffff");
      return arr;
    },
    [dimentions]
  );
  const [grid, setGrid] = useState(generateGrid);

  useEffect(() => {
    setGrid(generateGrid());
  }, [dimentions, generateGrid]);

  useEffect(() => {
    const gridDiv = document.getElementById("grid-div") as HTMLDivElement;
    gridDiv.addEventListener("mousedown", (e) => {
      e.preventDefault();
      setMouseIsDown(true);
    });
    gridDiv.addEventListener("mouseup", () => setMouseIsDown(false));
    return () => {
      gridDiv.removeEventListener("mousedown", (e) => {
        e.preventDefault();
        setMouseIsDown(true);
      });
      gridDiv.removeEventListener("mouseup", () => setMouseIsDown(false));
    };
  });

  return (
    <div className="app">
      <div
        className="grid"
        id="grid-div"
        style={{
          gridTemplateColumns: `repeat(${dimentions}, 1fr)`,
          gridTemplateRows: `repeat(${dimentions}, 1fr)`,
        }}
      >
        {grid.map((row, idx) => (
          <Square
            color={grid[idx]}
            key={idx}
            id={idx}
            border={border}
            mouseIsDown={mouseIsDown}
            onColor={(id) =>
              setGrid((grid) => {
                grid[id] = color;
                return [...grid];
              })
            }
          />
        ))}
      </div>
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
          max="80"
          value={dimentions}
          onChange={(e) => setDimensions(Number(e.target.value))}
        />
        <h5>
          {dimentions} x {dimentions}
        </h5>
        {dimentions > 40 && <h5>More than 40 x 40 pixels can be slow!</h5>}
        <input
          type="checkbox"
          checked={border}
          onChange={(e) => setBorder(e.target.checked)}
        />
        <button onClick={() => setGrid(generateGrid())}>Clear</button>
        <button onClick={() => setGrid(generateGrid(true))}>
          Random Colors
        </button>
      </div>
    </div>
  );
}

export default App;
