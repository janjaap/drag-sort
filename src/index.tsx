import React from "react";
import ReactDOM from "react-dom/client";
import { DragSort } from "./DragSort";
import './styles.css';

const rootElement = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <div style={{ width: '20rem', margin: '2rem auto' }}>
      <DragSort>
        <span>Item #1</span>
        <span>Item #2</span>
        <span>Item #3</span>
        <span>Item #4</span>
      </DragSort>
    </div>
  </React.StrictMode>
);
