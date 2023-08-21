import { useState } from "react";

import { produce } from "immer";

export const useAutofillFormState = () => {
	// Contains a map of autofill groups and their state [visibility]
	// Autofill form consists of autofill groups

	const [AutofillFormState, setAutofillFormState] = useState({});

	const addAutofillGroupState = (groupId) => {
		setAutofillFormState((prevState) => ({
			...prevState,
			[groupId]: {
				iconButton: false,
				inputPopup: false,
			},
		}));
	};

	const updateAutofillGroupState = (
		action,
		subject = null,
		groupId = null
	) => {
		// Focus group actions [iconButton, input, popup]
		if (subject === "iconButton") {
			setAutofillFormState(
				produce(AutofillFormState, (draftState) => {
					switch (action) {
						case "click":
							draftState[groupId].inputPopup =
								!draftState[groupId].inputPopup;
							break;
						case "mouseenter":
							draftState[groupId].iconButton = true;
							break;
						case "mouseleave":
							draftState[groupId].iconButton = false;
							break;
						default:
					}
				})
			);
		} else if (subject === "input") {
			setAutofillFormState(
				produce(AutofillFormState, (draftState) => {
					switch (action) {
						case "click":
							Object.entries(draftState).forEach(
								([otherGroupId]) => {
									if (otherGroupId !== groupId) {
										draftState[
											otherGroupId
										].iconButton = false;
										draftState[
											otherGroupId
										].inputPopup = false;
									}
								}
							);
							draftState[groupId].inputPopup = true;
							draftState[groupId].iconButton = true;
							break;
						case "focus":
							Object.entries(draftState).forEach(
								([otherGroupId]) => {
									if (otherGroupId !== groupId) {
										draftState[
											otherGroupId
										].iconButton = false;
										draftState[
											otherGroupId
										].inputPopup = false;
									}
								}
							);
							draftState[groupId].inputPopup = true;
							draftState[groupId].iconButton = true;
							break;
						case "blur":
							break;
						case "mouseenter":
							draftState[groupId].iconButton = true;
							break;
						case "mouseleave":
							draftState[groupId].iconButton = false;
							break;
						default:
					}
				})
			);
		}
		// Non-focus group actions [outside click]
		if (subject === "document") {
			setAutofillFormState(
				produce(AutofillFormState, (draftState) => {
					switch (action) {
						case "click":
							if (!groupId) {
								Object.entries(draftState).forEach(
									([otherGroupId]) => {
										draftState[
											otherGroupId
										].iconButton = false;
										draftState[
											otherGroupId
										].inputPopup = false;
									}
								);
							}
							break;
						case "focus":
							if (!groupId) {
								Object.entries(draftState).forEach(
									([otherGroupId]) => {
										draftState[
											otherGroupId
										].iconButton = false;
										draftState[
											otherGroupId
										].inputPopup = false;
									}
								);
							}
							break;
						default:
					}
				})
			);
		}
	};

	return {
		AutofillFormState,
		addAutofillGroupState,
		updateAutofillGroupState,
	};
};
