import { useEffect, useState } from "react";

import { useInputElements, useLoginFormDetector } from "./hooks";
import { Popup, IconButton } from "./components";
import { fakeItemList } from "./data";

function HeadlessApp() {
	const [itemList, setItemList] = useState([]);

  const { hasLoginForm } = useLoginFormDetector();
  const inputFields = useInputElements();

  inputFields.forEach((inputField, idx)=>{
    const autofillGroupId = (inputField.id??'').concat(`afg-${idx}`)
    const selector = `[data-autofill-group="${autofillGroupId}"]`

    inputField.setAttribute("data-autofill-group", autofillGroupId);

    document.querySelector(selector).addEventListener( 'blur',(event)=>{
      console.log("focus", event);
    })
    document.querySelector(selector).addEventListener( 'focus',(event)=>{
      console.log("focus", event);
    })
    document.querySelector(selector).addEventListener( 'click',(event)=>{
      console.log("click", event);
    })

    document.addEventListener("click", (event)=>{
      console.log(event);
      // if(event.target){

      // }
    })

    // function handleInputFieldEvent() {
    //   setShowPopup(true);
    // }

    // function handleClickOutside(event) {
    //   if (popupRef.current && !popupRef.current.contains(event.target) && !inputField.contains(event.target)) {
    //     console.log("handleClickOutside", "It will close!");
    //     setShowPopup(false);
    //   }
    // }

    // function handleBlur(event) {
    //   console.log("handleBlur", "It will close!");
    //   setTimeout(()=>setShowPopup(false), 50);
    // }

    // Attach the listeners to the inputField and document
    // inputField.addEventListener('focus', handleInputFieldEvent);
    // inputField.addEventListener('click', handleInputFieldEvent);
    // inputField.addEventListener('blur', handleBlur, false);
    // document.addEventListener('click', handleClickOutside, false);

    // Cleanup the listeners when the component is unmounted
    // return () => {
    //   inputField.removeEventListener('focus', handleInputFieldEvent);
    //   inputField.removeEventListener('click', handleInputFieldEvent);
    //   inputField.removeEventListener('blur', handleBlur, false);
    //   document.removeEventListener('click', handleClickOutside, false);
    // };    
  })

  useEffect(() => {
		console.log("Headless app got mounted");    
		setInterval(() => {
			setItemList(fakeItemList);
		}, 10000);
	}, []);

	// useEffect(() => {
	// 	console.log("Item list updated");
	// }, [itemList]);

	return (
		<>
			{hasLoginForm &&
				inputFields.map((inputField) => {
					return (
						<>
							<IconButton inputField={inputField} autofillGroupId={autofillGroupId}/>
							<Popup key={inputField.id} inputField={inputField} itemList={itemList} />
						</>
					);
				})}
		</>
	);
}

export default HeadlessApp;
