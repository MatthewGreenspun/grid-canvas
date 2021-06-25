import React, { useState, useCallback } from "react";
import { useEffect } from "react";
import Square from "./Square";

function App() {
  const [color, setColor] = useState("#0055ff");
  const [dimentions, setDimensions] = useState(20);
  const [mouseIsDown, setMouseIsDown] = useState(false);
  const [border, setBorder] = useState(true);
  const generateGrid = useCallback(() => {
    const arr = [];
    for (let i = 0; i < dimentions ** 2; i++) arr.push("#ffffff");
    return arr;
  }, [dimentions]);
  const [grid, setGrid] = useState(generateGrid);

  useEffect(() => {
    setGrid(generateGrid);
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
          onChange={(e) => setColor(e.target.value)}
        />
        <input
          type="range"
          min="1"
          max="50"
          value={dimentions}
          onChange={(e) => setDimensions(Number(e.target.value))}
        />
        <input
          type="checkbox"
          checked={border}
          onChange={(e) => setBorder(e.target.checked)}
        />
      </div>
    </div>
  );
}

export default App;
