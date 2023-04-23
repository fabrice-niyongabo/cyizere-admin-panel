import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// scroll bar
import "simplebar/src/simplebar.css";

// third-party
import { Provider as ReduxProvider } from "react-redux";

// apex-chart
import "./assets/third-party/apex-chart.css";
import "react-toastify/dist/ReactToastify.css";

// project import
import App from "./App";
import { PersistGate } from "redux-persist/integration/react";
import { Store, persistor } from "./store";
import reportWebVitals from "./reportWebVitals";

const container = document.getElementById("root");
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
  <StrictMode>
    <ReduxProvider store={Store}>
      <PersistGate persistor={persistor}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </ReduxProvider>
  </StrictMode>
);

reportWebVitals();
