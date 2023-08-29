import { useEffect, useState } from "react";

// import { useLoginFormDetector } from "./hooks";
import { AutofillGroup } from "./components";
import { fakeItemList } from "./data";
import { useAutofillFormState } from "./store";
import usePopupLoginDetector from "./hooks/usePopupLoginDetector";
import useInputElements from "./hooks/useInputElements";

const getItemList = (setLoggedIn) => {
	return new Promise((resolve, reject) => {
		if (
			chrome?.runtime?.sendMessage &&
			process.env.NODE_ENV === "production"
		) {
			chrome.runtime.sendMessage({ greeting: "hello" }, (response) => {
				const { meta, itemList } = response;
				console.log("vault data", meta, itemList);
				resolve(itemList);
				if (meta?.loggedIn) {
					setLoggedIn(true);
				}
			});
		} else {
			setLoggedIn(true);
			resolve(fakeItemList);
		}
	});
};

function HeadlessApp() {
	console.log("Rendering headless app");
	const [itemList, setItemList] = useState([]);
	const [loggedIn, setLoggedIn] = useState(false);

	const callback = (response) =>{
		const { meta, itemList } = response;
		// resolve(itemList);
		setItemList(itemList);
		if (meta?.loggedIn) {
			setLoggedIn(true);
		}
	}

	usePopupLoginDetector({ callback: callback });

	// const { hasLoginForm } = useLoginFormDetector();
	const hasLoginForm = true;
	const {
		AutofillFormState,
		addAutofillGroupState,
		updateAutofillGroupState,
	} = useAutofillFormState();

	const inputFields = useInputElements();

	console.log("Got inputFields", inputFields);

	inputFields.forEach((inputField, idx) => {
		const groupId = `${inputField.id}-afg${idx}`;
		inputField.dataset.autofillgroup = groupId;
		if (!AutofillFormState[groupId]) {
			addAutofillGroupState(groupId);
		}
	});

	useEffect(() => {
		console.log("Headless app got mounted");
		getItemList(setLoggedIn).then((itemList) => setItemList(itemList));

		const intervalId = setInterval(() => {
			getItemList(setLoggedIn).then((itemList) => setItemList(itemList));
		}, 30000);

		// Cleanup function
		return () => {
			clearInterval(intervalId);
		};
	}, []);

	return (
		<>
			{hasLoginForm &&
				inputFields.map((inputField) => {
					// console.warn("Processing input fields: ", inputField);
					return (
						<>
							<AutofillGroup
								key={inputField.dataset.autofillgroup}
								inputField={inputField}
								inputFields={inputFields}
								itemList={itemList}
								autofillGroupId={
									inputField.dataset.autofillgroup
								}
								AutofillFormState={AutofillFormState}
								updateAutofillGroupState={
									updateAutofillGroupState
								}
								loggedIn={loggedIn}
							/>
						</>
					);
				})}
		</>
	);
}

export default HeadlessApp;
