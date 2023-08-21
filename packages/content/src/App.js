import { useEffect, useState } from "react";

import { useInputElements, useLoginFormDetector } from "./hooks";
import { AutofillGroup } from "./components";
import { fakeItemList } from "./data";
import { useAutofillFormState } from "./store";

const getItemList = (setLoggedIn) => {
	return new Promise((resolve, reject) => {
		if (chrome?.runtime?.sendMessage && process.env.NODE_ENV === "production") {
			chrome.runtime.sendMessage({ greeting: "hello" }, (response) => {
				const { meta, itemList } = response;
				console.log("vault data", meta, itemList);
				resolve(itemList);
				if(meta?.loggedIn){
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
	const [itemList, setItemList] = useState([]);
	const [loggedIn, setLoggedIn] = useState(false);

	const { hasLoginForm } = useLoginFormDetector();
	const {
		AutofillFormState,
		addAutofillGroupState,
		updateAutofillGroupState,
	} = useAutofillFormState();
	const inputFields = useInputElements();

	// console.log(AutofillFormState);

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

		setInterval(() => {
			getItemList(setLoggedIn).then((itemList) => setItemList(itemList));
		}, 10000);
	}, []);

	return (
		<>
			{hasLoginForm &&
				inputFields.map((inputField) => {
					return (
						<>
							<AutofillGroup
								key={inputField.dataset.autofillgroup}
								inputField={inputField}
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
