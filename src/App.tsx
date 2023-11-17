import React from "react";
import { PrimeReactProvider } from "primereact/api";
// import logo from './logo.svg';
import "./global.scss";
import "./theme.css";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import Router from "screens/routes/Router";
import ErrorBoundary from "screens/common/ErrorBoundary";
import { BrowserRouter } from "react-router-dom";

function App() {
  const basename: string = process.env.REACT_APP_BASENAME || "";

  return (
    <PrimeReactProvider>
      <ErrorBoundary>
        <div className="h-full">
          <BrowserRouter basename={basename}>
            <Router />
          </BrowserRouter>
        </div>
      </ErrorBoundary>
    </PrimeReactProvider>
  );
}

export default App;
