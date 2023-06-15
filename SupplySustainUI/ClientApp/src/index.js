import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter , HashRouter } from "react-router-dom";

// translation
import "./components/i18n";

// scroll bar
import "simplebar/src/simplebar.css";

// third-party
import { Provider as ReduxProvider } from "react-redux";

// apex-chart
import "./assets/third-party/apex-chart.css";
// project import
import App from "./App";
import { store } from "./store/store";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorker from './serviceWorker';

// ==============================|| MAIN - REACT DOM RENDER  ||============================== //
const container = document.getElementById("root");
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
  // <StrictMode>
    <ReduxProvider store={store}>
        <HashRouter>
          <App />
        </HashRouter>
    </ReduxProvider>
  // </StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
