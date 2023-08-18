import { useState, useEffect } from "react";

export function useButtonPosition(inputField) {
	const [position, setPosition] = useState({ top: "0px", left: "0px" });

	useEffect(() => {
		if (inputField) {
			const rect = inputField.getBoundingClientRect();
			const horizontalSpacing = 8;

			const left =
				rect.left +
				window.pageXOffset +
				rect.width -
				24 -
				horizontalSpacing +
				"px";

			const top =
				rect.top + window.pageYOffset + rect.height / 2 - 24 / 2 + "px";

			setPosition({ top, left });
		}
	}, [inputField]);

	return position;
}

export function usePopupPosition(inputField) {
	const [position, setPosition] = useState({ top: 0, left: 0 });

	useEffect(() => {
		if (inputField) {
			const rect = inputField.getBoundingClientRect();
			setPosition({
				left: rect.left + window.pageXOffset,
				top: rect.top + rect.height + window.pageYOffset,
			});
		}
	}, [inputField]);

	return position;
}

export function useLoginFormDetector() {
	const passwordInputs = document.querySelectorAll('input[type="password"]');
	const emailInputs = document.querySelectorAll('input[type="email"]');
	const textInputs = document.querySelectorAll('input[type="text"]');

	// Check if there's at least one password input field.
	if (passwordInputs.length === 0) {
		return { hasLoginForm: false };
	}

	// Check if there's an email or text input field.
	if (emailInputs.length === 0 && textInputs.length === 0) {
		return { hasLoginForm: false };
	}

	return { hasLoginForm: true };
}

export function useInputElements() {
	const selector = `input[type="password"], input[type="text"], input[type="email"]`
	const [inputs, setInputs] = useState(document.querySelectorAll(selector));

	useEffect(() => {
		function handleMutation() {
			setInputs(document.querySelectorAll(selector));
		}

		const observer = new MutationObserver(handleMutation);

		observer.observe(document.body, { childList: true, subtree: true });

		return () => observer.disconnect();
	}, [selector]);

	return [...inputs];
}
