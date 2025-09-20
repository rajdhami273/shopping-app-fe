// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";

import { MantineProvider, createTheme } from "@mantine/core";
import { BrowserRouter } from "react-router";
import { routes } from "./routes/routes";

const theme = createTheme({
  fontFamily: "Open Sans, sans-serif",
  primaryColor: "indigo",
});

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <BrowserRouter>{routes}</BrowserRouter>
    </MantineProvider>
  );
}
