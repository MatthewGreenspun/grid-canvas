import Canvas from "./Canvas";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/core";

function App() {
  const theme = createMuiTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 770,
        lg: 1280,
        xl: 1920,
      },
    },
    palette: {
      primary: {
        light: "#80b4ff",
        main: "#4285f4",
        dark: "#0059c1",
        contrastText: "#fff",
      },
      secondary: {
        light: "#62727b",
        main: "#37474f",
        dark: "#102027",
        contrastText: "#fff",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Canvas />
    </ThemeProvider>
  );
}

export default App;
