/**
 * This file is the frontend entry point.
 * It tells React to render the App component inside the root HTML element.
 */

import React from "react"; // React is imported because JSX is used in this file.
import ReactDOM from "react-dom/client"; // ReactDOM creates a root and mounts the app to the page.

import App from "./App"; // App is the main component that contains all routes and pages.
import "../index.css"; // This imports global Tailwind and base CSS styles.

// Find the root HTML element where React app should mount.
const rootElement = document.getElementById("root");

// Check that root element exists before trying to render.
if (rootElement !== null) {
  // Create React root object from root DOM element.
  const reactRoot = ReactDOM.createRoot(rootElement);

  // Render the App component inside React strict mode.
  reactRoot.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
