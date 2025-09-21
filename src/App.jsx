// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";

import { MantineProvider, createTheme } from "@mantine/core";
import { BrowserRouter } from "react-router";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

// store
import { store, persistor } from "./state/store";

// routes
import { routes } from "./routes/routes";

const theme = createTheme({
  fontFamily: "Open Sans, sans-serif",
  primaryColor: "indigo",
});

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <Provider store={store}>
        <PersistGate loading={"Loading..."} persistor={persistor}>
          <BrowserRouter>{routes}</BrowserRouter>
        </PersistGate>
      </Provider>
    </MantineProvider>
  );
}
