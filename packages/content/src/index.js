import React from "react";
import ReactDOM from "react-dom";

import HeadlessApp from "./App";
import { createButton, createPopup } from "./components";
import { positionButton, positionPopup, identifyFieldType, hasLoginForm } from "./utils";

let fieldTypeMap = {};

// Iteratively Identify type of input fields present on the html page. 
const inputFields = document.querySelectorAll("input");
inputFields.forEach((input) => {
	const fieldsType = identifyFieldType(input);
	fieldTypeMap[input.id] = fieldsType;
	console.log("identifyFieldType", fieldsType);
});


// Show autofill suggestions if login form is present
if (hasLoginForm()) {
    console.log("Login form found!");
	const inputFields = document.querySelectorAll(
		`input[type="password"], input[type="text"], input[type="email"]`
	);

	inputFields.forEach((inputField) => {
		// Setup button for input field
		const button = createButton();
		button.id = `button-${inputField.id}`;
		positionButton(button, inputField);
		document.body.appendChild(button);

		window.addEventListener("resize", () => {
			positionButton(button, inputField);
		});

		// Setup autofill suggestion popup
		let popup = createPopup(fieldTypeMap[inputField.id], inputField, fieldTypeMap);
		popup.id = `popup-${inputField.id}`;

		// Toggle autofill suggestion popup on button click
		button.addEventListener("click", () => {
			if (!document.getElementById(popup.id)) {
				document.body.appendChild(popup);
			} else {
				popup.remove();
			}
		});

		positionPopup(popup, inputField);

		inputField.addEventListener("focus", () => {
			document.body.appendChild(popup);
		});

		inputField.addEventListener("blur", (e) => {
			popup.remove();
		});

		window.addEventListener("resize", () => {
			positionPopup(popup, inputField);
		});

		window.addEventListener("mouseup", (e) => {
			if (
				e.target !== popup &&
				e.target.parentNode !== popup &&
				e.target !== inputField
			) {
				popup.remove();
			}
		});
	});
} else { // todo - what happens if login form is not present
    console.log("No Login form found!");
}



// const body = document.querySelector("body");
// // const app = document.createElement("div");
// // app.id = "root-myapp";

// if (body) {
// 	// ReactDOM.render(<HeadlessApp />, body);
// 	//     body.prepend(app);
// }

// document.body.addEventListener("click", function (event) {
//   if (event.target.tagName.toLowerCase() === "input") {
//     alert("Input clicked!");

//     const div = document.createElement("div");
//     document.body.appendChild(div);

//     const rect = event.target.getBoundingClientRect();
//     div.style.position = "absolute";
//     div.style.left = rect.left + window.scrollX + "px";
//     div.style.top = rect.bottom + window.scrollY + "px";
//     div.style.zIndex = 1000;

//     ReactDOM.render(<Tooltip />, div);
//   }
// });

// function Tooltip() {
//     return (
//         <div style={{ border: "1px solid black", padding: "5px" }}>
//             Your Tooltip Content
//         </div>
//     );
// }
