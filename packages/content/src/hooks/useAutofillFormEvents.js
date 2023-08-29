import { useEffect } from "react";

export const useAutofillFormEvents = (
	inputField,
	autofillGroupId,
	updateAutofillGroupState
) => {
	useEffect(() => {
		if (inputField) {
			const handleInputFocusEvent = (e) =>
				updateAutofillGroupState("focus", "input", autofillGroupId);
			const handleInputClickEvent = (e) =>
				updateAutofillGroupState("click", "input", autofillGroupId);
			const handleInputBlurEvent = (e) =>
				updateAutofillGroupState("blur", "input", autofillGroupId);
			const handleInputMouseenterEvent = (e) =>
				updateAutofillGroupState(
					"mouseenter",
					"input",
					autofillGroupId
				);
			const handleInputMouseleaveEvent = (e) =>
				updateAutofillGroupState(
					"mouseleave",
					"input",
					autofillGroupId
				);
			const handleDocumentClick = (e) =>
				updateAutofillGroupState(
					"click",
					"document",
					e.target.dataset.autofillgroup
				);

			// Attach the listeners to the inputField and document
			inputField.addEventListener("focus", handleInputFocusEvent);
			inputField.addEventListener("click", handleInputClickEvent);
			inputField.addEventListener("blur", handleInputBlurEvent, false);
			inputField.addEventListener(
				"mouseenter",
				handleInputMouseenterEvent
			);
			inputField.addEventListener(
				"mouseleave",
				handleInputMouseleaveEvent
			);
			document.addEventListener("click", handleDocumentClick, false);

			// Cleanup the listeners when the component is unmounted
			return () => {
				inputField.removeEventListener("focus", handleInputFocusEvent);
				inputField.removeEventListener("click", handleInputClickEvent);
				inputField.removeEventListener(
					"blur",
					handleInputBlurEvent,
					false
				);
				inputField.removeEventListener(
					"mouseenter",
					handleInputMouseenterEvent
				);
				inputField.removeEventListener(
					"mouseleave",
					handleInputMouseleaveEvent
				);
				document.removeEventListener(
					"click",
					handleDocumentClick,
					false
				);
			};
		}
	}, [inputField, autofillGroupId, updateAutofillGroupState]);
};

export default useAutofillFormEvents;