import React from "react";
import ReactDOM from "react-dom/client"; // Use 'react-dom/client' for React 18
import "./assets/scss/styles.scss";
import App from "./App";
import QueryProvider from "./providers/QueryProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <QueryProvider>
        <App />
    </QueryProvider>
);
