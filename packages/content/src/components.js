import { useState, useEffect, useRef } from "react";
import { useButtonPosition, usePopupPosition } from "./hooks";

export function IconButton({ inputField }) {
	const { top, left } = useButtonPosition(inputField);
	// const imgSrc = chrome.runtime.getURL("Logo-mini-derived.png");
	const imgSrc = "./Logo-mini-derived.png";
	const buttonRef = useRef(null);

	return (
		<button
			ref={buttonRef}
			id={`button-${inputField.id}`}
			className="absolute flex items-center justify-center w-6 h-6 border border-gray-300 rounded z-50 cursor-pointer bg-transparent"
			style={{ top, left }}
			// onClick={togglePopup}
		>
			<img src={imgSrc} className="w-4/5 h-4/5 object-contain" alt="tf" />
		</button>
	);
}

function PopupItem({ inputField, itemData }) {
	const itemRef = useRef(null);

	// useEffect(()=>{
	// 	if(itemRef){
	// 		itemRef.current.addEventListener("blur", ()=>{})
	// 	}
	// },[inputField])

	const handleClick = (event) => {
		console.log("Auto fill didn't ran!");
		inputField.value = event.target.textContent;
	};

	return (
		<div
			className="flex flex-row items-center px-2 py-1 rounded cursor-pointer gap-2 hover:bg-gray-700 transition-colors"
			onClick={handleClick}
			// onMouseDown={handleClick}
		>
			<img
				src={itemData.iconDataUrl}
				className="flex w-8 h-8"
				alt={itemData.title[0]}
			/>
			<div className="flex flex-col">
				<div className="text-white text-lg">{itemData.title}</div>
				<div className="text-gray-400 text-sm">{itemData.username}</div>
			</div>
		</div>
	);
}

export function Popup({ inputField, itemList }) {
	const popupRef = useRef(null);
	// const [showPopup, setShowPopup] = useState(false);
	const { top, left } = usePopupPosition(inputField);

    // useEffect(() => {
	// 	if(inputField){

	// 	}
    // }, [inputField, setShowPopup]);


	return (
		<div
			id={`popup-${inputField.id}`}
			ref={popupRef}
			className="bg-gray-900 p-3 rounded absolute z-40"
			style={{ top, left }}
		>
			{itemList.map((itemData) => (
				<div key={itemData.id} className="mb-2 last:mb-0">
					<PopupItem inputField={inputField} itemData={itemData} />
				</div>
			))}
		</div>
	);
}