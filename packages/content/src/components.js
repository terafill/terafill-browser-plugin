import { dataMap, targetItemList } from "./utils";

export function createButton() {
	const button = document.createElement("button");
	const icon = document.createElement("img");
	icon.src = chrome.runtime.getURL("Logo-mini-derived.png");
    
	icon.style.width = "80%";
	icon.style.height = "80%";
	icon.style.objectFit = "contain"; // Use the correct style syntax

	button.style.width = "24px";
	button.style.height = "24px";
	button.style.position = "absolute";
	button.style.display = "flex";
	button.style.justifyContent = "center";
	button.style.alignItems = "center";

	button.style.zIndex = 2147483647;
	// button.style.border = 0.4;
	button.style.border = "1px solid lightgray";
	button.style.borderRadius = "5px";
	button.style.padding = 0;
	button.style.backgroundColor = "transparent"; // Set the button's background to transparent
	button.style.cursor = "pointer"; // Change the cursor to a pointer when hovering over the button

	button.appendChild(icon);
	return button;
}

function createPopupItem(inputField, itemData){
    const item = document.createElement("div");

    const itemHeading = document.createElement("div");
    itemHeading.innerHTML = itemData.title;
    itemHeading.style.fontSize = "16px";
    itemHeading.style.color = "white";

    const itemLabel = document.createElement("div");
    itemLabel.innerHTML = itemData.username;
    itemLabel.style.fontSize = "12px";
    itemLabel.style.color = "lightgray";


    // item.style.fontFamily = "'Inter', sans-serif";
    item.style.display = "flex";
    item.style.flexDirection = "column";
    item.style.alignItems = "start";
    item.style.padding = "4px 8px";
    item.style.borderRadius = "3px";
    item.style.cursor = "pointer";

    item.appendChild(itemHeading);
    item.appendChild(itemLabel);

    item.addEventListener("click", (event) => {
        inputField.value = event.target.textContent;
    });
    // Change background color on mouse enter (hover)
    item.addEventListener("mouseenter", function () {
        item.style.backgroundColor = "#333333";
    });

    // Reset background color on mouse leave
    item.addEventListener("mouseleave", function () {
        item.style.backgroundColor = ""; // You can set this to the original color if it's not transparent
    });
    
    return item;
}


export function createPopup(fieldType, inputField, fieldTypeMap, itemList) {
	const popup = document.createElement("div");
	popup.innerHTML = "";
	popup.style.backgroundColor = "#1a1a1a";
    popup.style.zIndex = 9999;
    popup.style.position = "absolute";
    popup.style.padding = "12px";
    popup.style.borderRadius = "5px";

	if (fieldType === "unknown") {
		// Object.entries(dataMap).forEach(([fieldType, fieldList]) => {
		// 	fieldList.map((value) => {
		// 		const item = createPopupItem(inputField, value);
		// 		popup.appendChild(item);
		// 	});
		// });
        itemList.map(itemData => {
            const item = createPopupItem(inputField, itemData);
            popup.appendChild(item);            
        })
	} else {
        itemList.map(itemData => {
            const item = createPopupItem(inputField, itemData);
            popup.appendChild(item);

			// Change background color on mouse enter (hover)
			item.addEventListener("mouseenter", function () {
				item.style.backgroundColor = "#333333";
			});

			// Reset background color on mouse leave
			item.addEventListener("mouseleave", function () {
				item.style.backgroundColor = ""; // You can set this to the original color if it's not transparent
			});
			item.addEventListener("click", (event) => {
				inputField.value = event.target.textContent;
			});
			popup.appendChild(item);
        })
		// dataMap[fieldType].forEach((value) => {
		// 	const item = createPopupItem(inputField, value);

		// 	// Change background color on mouse enter (hover)
		// 	item.addEventListener("mouseenter", function () {
		// 		item.style.backgroundColor = "#333333";
		// 	});

		// 	// Reset background color on mouse leave
		// 	item.addEventListener("mouseleave", function () {
		// 		item.style.backgroundColor = ""; // You can set this to the original color if it's not transparent
		// 	});
		// 	item.addEventListener("click", (event) => {
		// 		inputField.value = event.target.textContent;
		// 	});
		// 	popup.appendChild(item);
		// });
	}

	// popup.classList.add("your-popup-class");
	return popup;
}
