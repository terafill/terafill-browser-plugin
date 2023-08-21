import React from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import HeadlessApp from "./App";

// const contentBody = document.createElement("div");
// document.body.appendChild(contentBody);

const body = document.querySelector("body");
const app = document.createElement("div");
app.id = "tf-content-app-root";
app.style.zIndex = "9999";

const root = createRoot(app);

if (body) {
	root.render(<HeadlessApp />);
	body.prepend(app);
}
