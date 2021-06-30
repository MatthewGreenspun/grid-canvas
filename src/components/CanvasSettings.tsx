import React from "react";
import Color from "./Color";

interface Props {
  dimensions: number;
  setDimensions: React.Dispatch<React.SetStateAction<number>>;
  border: boolean;
  setBorder: React.Dispatch<React.SetStateAction<boolean>>;
  color: string;
  setColor: React.Dispatch<React.SetStateAction<string>>;
  colors: Set<string>;
  setColors: React.Dispatch<React.SetStateAction<Set<string>>>;
  setGrid: React.Dispatch<React.SetStateAction<string[]>>;
  generateGrid: (
    random?: boolean | undefined,
    color?: string | undefined
  ) => string[];
}

const CanvasSettings: React.FC<Props> = ({
  color,
  colors,
  setColor,
  setColors,
  dimensions,
  setDimensions,
  border,
  setBorder,
  setGrid,
  generateGrid,
}) => {
  return (
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
        value={dimensions}
        onChange={(e) => setDimensions(Number(e.target.value))}
      />
      <h5>
        {dimensions} x {dimensions}
      </h5>
      <input
        type="checkbox"
        checked={border}
        onChange={(e) => setBorder(e.target.checked)}
      />
      <button onClick={() => setGrid(generateGrid())}>Clear</button>
      <button onClick={() => setGrid(generateGrid(true))}>Random Colors</button>
      <button onClick={() => setGrid(generateGrid(false, color))}>
        Fill color
      </button>
    </div>
  );
};

export default CanvasSettings;
