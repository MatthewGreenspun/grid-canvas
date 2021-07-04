import { useState, useCallback, useEffect, useRef } from "react";
import Link from "@material-ui/core/Link";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Box from "@material-ui/core/Box";
import CanvasSettings from "./CanvasSettings";

const generateRandomColor = () => {
  const posibilities = "0123456789abcdef";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += posibilities[Math.floor(Math.random() * 16)];
  }
  return color;
};

function Canvas() {
  const [color, setColor] = useState("#0055ff");
  const [colors, setColors] = useState(new Set<string>());
  const [dimensions, setDimensions] = useState(16);
  const [mouseIsDown, setMouseIsDown] = useState(false);
  const [border, setBorder] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

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
      for (let i = 0; i < dimensions ** 2; i++) {
        arr.push(random ? generateRandomColor() : color ? color : "#ffffff");
      }
      return arr;
    },
    [dimensions]
  );
  const [grid, setGrid] = useState(generateGrid);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setGrid(generateGrid());
  }, [dimensions, generateGrid, scaleCanvas]);

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
    if (ctx && canvas) {
      scaleCanvas(canvas);

      const squareLength = Math.round(canvas.width / dimensions);
      const rows = dimensions;
      const cols = dimensions;
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
  }, [dimensions, scaleCanvas, grid, border]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      justifyContent="center"
    >
      <canvas
        ref={canvasRef}
        height={dimensions}
        width={dimensions}
        style={{
          minWidth: "300px",
          maxWidth: "vw",
          maxHeight: "vh",
          aspectRatio: "1 / 1",
        }}
        onClick={({ clientX, clientY, currentTarget }) => {
          setGrid((grid) => {
            const squareLength = currentTarget.width / dimensions;
            const row = Math.floor(clientY / squareLength);
            const col = Math.floor(clientX / squareLength);
            const idx = row * dimensions + col;
            grid[idx] = color;
            return [...grid];
          });
        }}
        onMouseMove={({ clientX, clientY, currentTarget }) => {
          if (mouseIsDown) {
            setGrid((grid) => {
              const squareLength = currentTarget.width / dimensions;
              const row = Math.floor(clientY / squareLength);
              const col = Math.floor(clientX / squareLength);
              const idx = row * dimensions + col;
              grid[idx] = color;
              return [...grid];
            });
          }
        }}
      />
      <CanvasSettings
        {...{
          dimensions,
          setDimensions,
          border,
          setBorder,
          color,
          setColor,
          setGrid,
          colors,
          setColors,
          generateGrid,
        }}
      />
      <Button
        onClick={() => setIsDownloading(true)}
        color="secondary"
        variant="contained"
      >
        Download
      </Button>
      <Dialog open={isDownloading} onClose={() => setIsDownloading(false)}>
        <DialogTitle>Preview Image</DialogTitle>
        <DialogContent>
          <img src={canvasRef.current?.toDataURL("image/png")} alt="drawing" />
        </DialogContent>
        <DialogContent>
          <Button color="secondary" variant="contained">
            <Link
              underline="none"
              href={canvasRef.current?.toDataURL("img/png")}
              download
              onClick={() => setIsDownloading(false)}
            >
              Download
            </Link>
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default Canvas;
