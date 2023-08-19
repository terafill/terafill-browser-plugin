import { useState, useEffect, useRef } from "react";
import { useButtonPosition, usePopupPosition, useInputElements } from "./hooks";

import { identifyFieldType } from "./utils";

export function AutofillGroup({ inputField, itemList, autofillGroupId }) {
	const popupRef = useRef(null);
	const [showPopup, setShowPopup] = useState(false);
	const [showButton, setShowButton] = useState(false);
	const { top, left } = usePopupPosition(inputField);

	const togglePopup = ()=>{
		console.log("triggered", showPopup);
		if(showPopup){
			setShowPopup(false);
		}
		else{
			setShowPopup(true);
		}
		
	}

	const { top: iconButtonTop, left: iconButtonLeft } =
	useButtonPosition(inputField);
	const imgSrc = chrome.runtime.getURL("Logo-mini-derived.png");
	// const imgSrc = "./Logo-mini-derived.png";

	useEffect(() => {
		if (inputField) {
			function handleInputFieldEvent() {
				setShowPopup(true);
				setShowButton(true)
			}

			function handleClickOutside(event) {
				if (
					popupRef.current &&
					!popupRef.current.contains(event.target) &&
					!inputField.contains(event.target)
				) {
					setShowPopup(false);
					setShowButton(false);
				}
			}

			function handleBlur(event) {
				setTimeout(() => {
					setShowPopup(false);
					setShowButton(false);
				}, 100);
			}

			const handleHoverEnable = (e)=>{e.stopPropagation();setShowButton(true)}
			const handleHoverDisable = (e)=>{e.stopPropagation();setShowButton(false)}

			// Attach the listeners to the inputField and document
			inputField.addEventListener("focus", handleInputFieldEvent);
			inputField.addEventListener("click", handleInputFieldEvent);
			inputField.addEventListener("blur", handleBlur, false);
			document.addEventListener("click", handleClickOutside, false);
			inputField.addEventListener('mouseenter', handleHoverEnable);
			inputField.addEventListener('mouseleave', handleHoverDisable);

			// Cleanup the listeners when the component is unmounted
			return () => {
				inputField.removeEventListener("focus", handleInputFieldEvent);
				inputField.removeEventListener("click", handleInputFieldEvent);
				inputField.removeEventListener("blur", handleBlur, false);
				document.removeEventListener(
					"click",
					handleClickOutside,
					false
				);
				inputField.removeEventListener('mouseenter', handleHoverEnable);
				inputField.removeEventListener('mouseleave', handleHoverDisable);
			};
		}
	}, [inputField, setShowPopup]);

	const inputFields = useInputElements();

	const handleItemClick = (event, itemData) => {
		inputFields.forEach((inputField) => {
			const fieldType = identifyFieldType(inputField);
			console.log(fieldType);
			if (fieldType in itemData) {
				inputField.value = itemData[fieldType];
			} else if (
				fieldType === "confirmpassword" &&
				"password" in itemData
			) {
				inputField.value = itemData["password"];
			}
		});
		// inputField.value = event.target.textContent;
	};
	return (
		<>
			{showButton && (
				<button
					id="icon-button"
					className="absolute flex items-center justify-center w-6 h-6 border border-gray-300 rounded z-50 cursor-pointer bg-transparent"
					style={{ top: iconButtonTop, left: iconButtonLeft }}
					data-autofillgroup={autofillGroupId}
					onClick={(e)=>{e.stopPropagation();togglePopup();}}
					onMouseEnter={(e)=>{e.stopPropagation();setShowButton(true)}}
					onMouseLeave={(e)=>{e.stopPropagation();setShowButton(true)}}
				>
					<img
						src={imgSrc}
						className="w-4/5 h-4/5 object-contain"
						alt="tf"
					/>
				</button>
			)}
			{showPopup && (
				<div
					id="input-popup"
					ref={popupRef}
					className=" bg-gray-900 p-3 rounded absolute z-40"
					style={{ top, left }}
					data-autofillgroup={autofillGroupId}
				>
					{itemList.map((itemData) => (
						<div
							id="input-popup-item"
							key={itemData.id}
							data-item-id={itemData.id}
							onClick={(e) => handleItemClick(e, itemData)}
							className="mb-2 last:mb-0 flex flex-row items-center px-2 py-1 rounded cursor-pointer gap-2 hover:bg-gray-700 transition-colors"
						>
							<img
								src={itemData.iconDataUrl}
								className="flex w-8 h-8"
								alt={itemData.title[0]}
							/>
							<div className="flex flex-col">
								<div className="text-white text-lg">
									{itemData.title}
								</div>
								<div className="text-gray-400 text-sm">
									{itemData.username}
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</>
	);
}
