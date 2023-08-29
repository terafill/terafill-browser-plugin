import useAutofillFormEvents from "./hooks/useAutofillFormEvents";
import useButtonPosition from "./hooks/useButtonPosition";
import usePopupPosition from "./hooks/usePopupPosition";

import "./components.css";

import { identifyFieldType } from "./utils";

export function AutofillGroup({
	inputField,
	inputFields,
	itemList,
	autofillGroupId,
	AutofillFormState,
	updateAutofillGroupState,
	loggedIn,
}) {
	const { top, left } = usePopupPosition(inputField);

	const { top: iconButtonTop, left: iconButtonLeft } =
		useButtonPosition(inputField);
	let imgSrc = "/Logo-mini-derived-128.png";
	if (chrome?.runtime?.getURL) {
		imgSrc = chrome.runtime.getURL("./Logo-mini-derived-128.png");
	}

	// Set event handlers
	useAutofillFormEvents(
		inputField,
		autofillGroupId,
		updateAutofillGroupState
	);

	let fieldType = identifyFieldType(inputField);
	if (["email", "phone", "username"].includes(fieldType)) {
		fieldType = "username";
	}

	const handleItemClick = (event, itemData) => {
		const fillInput = (inputField, value) => {
			inputField.focus();
			inputField.value = value;
			let event = new Event("input", { bubbles: true });
			inputField.dispatchEvent(event);
		};

		inputFields.forEach((inputField) => {
			if (fieldType in itemData) {
				console.log("Filling data", inputField, itemData[fieldType]);
				fillInput(inputField, itemData[fieldType]);
			} else if (
				fieldType === "confirmpassword" &&
				"password" in itemData
			) {
				fillInput(inputField, itemData["password"]);
			} else {
				console.log("Not autofilled!");
			}
		});
	};
	return (
		<>
			{fieldType && AutofillFormState[autofillGroupId]?.iconButton && (
				<button
					id="icon-button"
					className="tfafg-icon-button"
					// className="absolute flex items-center justify-center w-6 h-6 border border-gray-300 rounded z-50 cursor-pointer bg-transparent"
					style={{ top: iconButtonTop, left: iconButtonLeft }}
					data-autofillgroup={autofillGroupId}
					onClick={(e) => {
						updateAutofillGroupState(
							"click",
							"iconButton",
							autofillGroupId
						);
					}}
					onMouseEnter={(e) => {
						updateAutofillGroupState(
							"mouseenter",
							"iconButton",
							autofillGroupId
						);
					}}
					onMouseLeave={(e) => {
						updateAutofillGroupState(
							"mouseleave",
							"iconButton",
							autofillGroupId
						);
						e.stopPropagation();
					}}
				>
					<img
						src={imgSrc}
						// className="w-4/5 h-4/5 object-contain"
						className="tfafg-image-contain"
						alt="tf"
					/>
					{!loggedIn && (
						<div
							//    className="absolute flex top-[-56px] left-[0px] w-60 bg-gray-900 rounded-md text-gray-200"
							className="tfafg-popup-hint"
						>
							Press the terafill icon in your browser's toolbar to
							unlock.
						</div>
					)}
				</button>
			)}
			{fieldType &&
				loggedIn &&
				AutofillFormState[autofillGroupId]?.inputPopup && (
					<div
						id="input-popup"
						// ref={popupRef}
						// className=" bg-gray-900 p-3 rounded absolute z-40"
						className="tfafg-input-popup"
						style={{ top, left }}
						data-autofillgroup={autofillGroupId}
					>
						{itemList && itemList.length > 0 ? (
							itemList.map((itemData) => (
								<div
									id="input-popup-item"
									key={itemData.id}
									data-item-id={itemData.id}
									onClick={(e) =>
										handleItemClick(e, itemData)
									}
									// className="mb-2 last:mb-0 flex flex-row items-center px-2 py-1 rounded cursor-pointer gap-2 hover:bg-gray-700 transition-colors"
									className="tfafg-input-popup-item"
								>
									<img
										src={itemData.iconDataUrl}
										// className="flex w-8 h-8"
										className="tfafg-flex-image"
										alt={itemData.title[0]}
									/>
									<div
										// className="flex flex-col"
										className="tfafg-flex-column"
									>
										<div
											// className="text-white text-lg"
											className="tfafg-text-lg-white"
										>
											{itemData.title}
										</div>
										<div
											// className="text-gray-400 text-sm"
											className="tfafg-text-sm-gray"
										>
											{itemData.username}
										</div>
									</div>
								</div>
							))
						) : (
							<div
								id="input-popup-item"
								key={"not-found"}
								data-item-id={"not-found"}
								// onClick={(e) => handleItemClick(e, itemData)}
								// className="mb-2 last:mb-0 flex flex-row items-center px-2 py-1 rounded cursor-pointer gap-2 hover:bg-gray-700 transition-colors"
								className="tfafg-input-popup-item"
							>
								<div
									// className="flex flex-col"
									className="tfafg-flex-column"
								>
									<div
										// className="text-white text-lg"
										className="tfafg-text-lg-white"
									>
										{"No items found."}
									</div>
								</div>
							</div>
						)}
					</div>
				)}
		</>
	);
}
