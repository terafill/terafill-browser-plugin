import { useEffect, useState } from "react";

import { useInputElements, useLoginFormDetector } from "./hooks";
import { AutofillGroup } from "./components";
import { fakeItemList } from "./data";


const getItemList = () => {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ greeting: "hello" }, (response) => {
            const { itemList } = response;
            console.log("vault data", itemList);
            resolve(itemList);
        });
    });
}



function HeadlessApp() {
	const [itemList, setItemList] = useState([]);

	const { hasLoginForm } = useLoginFormDetector();
	const inputFields = useInputElements();

	inputFields.forEach((inputField, idx) => {
		inputField.dataset.autofillgroup = `${inputField.id}-afg${idx}`;
	});

	useEffect(() => {
		console.log("Headless app got mounted");
		// setItemList(fakeItemList);
		const itemList = getItemList();
		setItemList(itemList)
		setInterval(async () => {
			const itemList = getItemList();
			setItemList(itemList);
			// setItemList(fakeItemList);
		}, 10000);
	}, []);

	return (
		<>
			{hasLoginForm &&
				inputFields.map((inputField) => {
					return (
						<>
							<AutofillGroup
								key={inputField.id}
								inputField={inputField}
								itemList={itemList}
								autofillGroupId={
									inputField.dataset.autofillgroup
								}
							/>
						</>
					);
				})}
		</>
	);
}

export default HeadlessApp;
