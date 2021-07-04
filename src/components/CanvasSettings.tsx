import React from "react";
import Box from "@material-ui/core/Box";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Slider from "@material-ui/core/Slider";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import Color from "./Color";
import { useTheme } from "@material-ui/core/styles";

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
  const theme = useTheme();

  return (
    <Box
      display="flex"
      flexDirection="column"
      p={2}
      m={2}
      border="1px solid black"
      borderRadius="4px"
      style={{ backgroundColor: theme.palette.secondary.main, color: "white" }}
    >
      <input
        style={{
          border: 0,
          padding: 3,
          borderRadius: 400,
          boxSizing: "content-box",
          margin: 2,
          backgroundColor: color,
        }}
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
      <Slider
        min={1}
        max={100}
        value={dimensions}
        onChange={(e, newVal) => setDimensions(newVal as number)}
      />
      <h5>
        {dimensions} x {dimensions}
      </h5>
      <FormControlLabel
        control={
          <Checkbox
            color="primary"
            checked={border}
            onChange={(e) => setBorder(e.target.checked)}
          />
        }
        label="Show Grid"
      />
      <ButtonGroup>
        <Button
          color="primary"
          variant="contained"
          onClick={() => setGrid(generateGrid())}
        >
          Clear
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={() => setGrid(generateGrid(true))}
        >
          Random Colors
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={() => setGrid(generateGrid(false, color))}
        >
          Fill color
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export default CanvasSettings;
