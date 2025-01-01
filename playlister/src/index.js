import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import './index.css';

const root = document.getElementById("root"); // Ensure this is correct
if (root) {
  const rootElement = ReactDOM.createRoot(root);
  rootElement.render(<App />);
} else {
  console.error('Root element not found!');
}
