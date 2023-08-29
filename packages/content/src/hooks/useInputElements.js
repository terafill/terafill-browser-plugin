import { useState, useEffect } from "react";

function isElementVisible(el) {
	if (!el) {
		return false;
	}
	// console.log("el", el);
	// Recursive function to check the visibility and opacity of parent elements
	// function checkParentVisibility(node) {
	// 	if (!node || node === document.body) return true; // Ensure 'node' is not null or document
	// 	const style = window.getComputedStyle(node);
	// 	if (
	// 		style.display === "none" ||
	// 		style.visibility === "hidden" ||
	// 		parseFloat(style.opacity) === 0
	// 	)
	// 		return false;
	// 	return checkParentVisibility(node.parentNode);
	// }

	// console.log("checkParentVisibility(el)", checkParentVisibility(el));

	// if (!checkParentVisibility(el)) return false;

	const style = window.getComputedStyle(el);
	if (
		style.display === "none" ||
		style.visibility === "hidden" ||
		parseFloat(style.opacity) === 0
	)
		return false;

	const rect = el.getBoundingClientRect();
	if (rect.width === 0 || rect.height === 0) return false;

	const windowHeight =
		window.innerHeight || document.documentElement.clientHeight;
	const windowWidth =
		window.innerWidth || document.documentElement.clientWidth;
	const vertInView = rect.top <= windowHeight && rect.top + rect.height >= 0;
	const horInView = rect.left <= windowWidth && rect.left + rect.width >= 0;

	return vertInView && horInView;
}

const isValidInputField = (input) => {
	// console.log(input, isElementVisible(input), input.disabled, input.readOnly);
	if (isElementVisible(input) && !input.disabled && !input.readOnly) {
		return true;
	}
	return false;
};

const getValidInputs = () => {
	// Filter using input type
	const inputTypeList = ["password", "text", "email", "number", "tel"];
	const selector = "".concat(
		inputTypeList.map((type) => `input[type=${type}]`)
	);
	const inputList = [...document.querySelectorAll(selector)];
	// console.log("filtered input list(stage-1): ", inputList);

	const filteredInputtList = inputList.filter((input) =>
		isValidInputField(input)
	);

	// console.log("filtered input list(stage-2):", filteredInputtList);

	return filteredInputtList;
};

export function useInputElements() {
	const [inputs, setInputs] = useState([]);

	useEffect(() => {
		const newInputs = getValidInputs();
		if (newInputs && newInputs.length > 0) {
			setInputs(newInputs);
		}
		function handleMutation(mutationsList) {
			// console.log("Handling mutation", mutationsList);
			const newInputs = getValidInputs();
			if (newInputs && newInputs.length > 0) {
				setInputs(newInputs);
			}
		}
		const observer = new MutationObserver(handleMutation);

		observer.observe(document.body, { childList: true, subtree: true });

		window.onload = function () {
			console.log("Everything, including external resources, is loaded");
			const newInputs = getValidInputs();
			if (newInputs && newInputs.length > 0) {
				setInputs(newInputs);
			}
		};

		// Remember to clean it up if you set another handler later or on component unmount
		return () => {
			window.onload = null;
			observer.disconnect();
		};
	}, []);

	return inputs;
}

export default useInputElements;
