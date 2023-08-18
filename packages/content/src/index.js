import React from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import HeadlessApp from "./App";

// // Usage example:
// setExpoTimeout(
// 	async () => {
// 		// const response = await chrome.runtime.sendMessage({
// 		// 	greeting: "hello",
// 		// }, async (response) => {
// 		// 	console.log("callback response", response);
// 		// 	// const { itemList } = response;
// 		// 	console.log("vault data", itemList);
// 		// 	await setUpPopup(itemList);
// 		// });

// 		const itemList = fakeItemList;
// 		console.log("vault data", itemList);
// 		// await setUpPopup(itemList);

// 		// do something with response here, not outside the function
// 		// console.log(response);
// 		// console.log("Sent a new batch of meta info.");
// 	},
// 	1000,
// 	320000,
// 	Infinity,
// 	true
// );

const contentBody = document.createElement("div");
document.body.appendChild(contentBody);

const body = document.querySelector("body");
const app = document.createElement("div");
app.id = "tf-content-app-root";
const root = createRoot(app);

if (body) {
	root.render(<HeadlessApp />);
	body.prepend(app);
}