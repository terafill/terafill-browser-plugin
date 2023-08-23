import Fuse from "fuse.js";

// Fields metadata
export const fieldTypes = [
	{
		type: "firstname",
		keywords: [
			"first",
			"name",
			"given",
			"givenname",
			"given name",
			"firstname",
			"first name"
		],
	},
	{
		type: "lastname",
		keywords: [
			"last",
			"surname",
			"family",
			"familyname",
			"family name",
			"lastname",
			"last name",
		],
	},
	{ type: "username", keywords: ["username", "user name"] },
	{ type: "password", keywords: ["password", "pass", "pwd"] },
	{ type: "email", keywords: ["email", "mail", "email id", "emailid", "email address", "emailaddress"] },
	{ type: "phone", keywords: ["phone", "tel", "mobile", "phone number", "cell"] },
	{
		type: "confirmpassword",
		keywords: [
			"confirm password",
			"confirmpassword",
			"verify password",
			"verifypassword",
			"password again",
			"passwordagain"
		],
	},
];

var keywordsMap = {};
fieldTypes.forEach(fieldData => {
	keywordsMap[fieldData.type] = fieldData.keywords
});

// function getDomain(url) {
//     try {
//         let parsedUrl = new URL(url);
//         return parsedUrl.hostname;
//     } catch (e) {
//         console.error(`Invalid URL: ${url}`);
//         return null;
//     }
// }

// function haveSameDomain(url1, url2) {
//     return getDomain(url1) === getDomain(url2);
// }

const options = {
	keys: ["keywords"],
	threshold: 0.3,
	includeScore: true,
};

const fuse = new Fuse(fieldTypes, options);


function getInputData(input) {

    const inputData =  {
        type: input.type,
        attributes: Array.from(input.attributes).reduce((acc, attribute) => {
            acc[attribute.name] = attribute.value;
            return acc;
        }, {}),
        computedStyles: (() => {
            const styles = window.getComputedStyle(input);
            return {
                display: styles.display,
                opacity: styles.opacity,
                visibility: styles.visibility,
                width: styles.width,
                height: styles.height,
                position: styles.position,
                left: styles.left,
                top: styles.top
            };
        })(),
        associatedLabel: input.labels?.[0]?.textContent || null,
        placeholder: input.placeholder,
        parentAttributes: Array.from(input.parentElement.attributes).reduce((acc, attribute) => {
            acc[attribute.name] = attribute.value;
            return acc;
        }, {}),
        domain: window.location.hostname
    };

    return inputData;
}


function textCleaner(text) {
    if (typeof text !== "string") {
        return "";
    }

    // Keep only alphabets and spaces
    text = text.replace(/[^a-zA-Z\s]/g, ' ');

    // Replace extra spaces
    text = text.replace(/\s+/g, ' ');

    // Trim leading and trailing spaces
    return text.trim();
}


// Takes <input> html element as input and identify the type of input field.
// Outputs: ["email", "password", "confirmpassword", "username"]
export function identifyFieldType(inputField) {

	if(inputField.type === "password"){
		return "password"
	}
	else if(inputField.type === "email"){
		return "email"
	}
	else{
	// let bestMatch = { score: Infinity, type: "unknown" };

	const inputData = getInputData(inputField);

	const cleanedLabel = textCleaner(inputData.associatedLabel);
    const cleanedPlaceholder = textCleaner(inputData.placeholder);
    const ariaLabel = textCleaner(inputData.attributes['aria-label']);
    const autoComp = textCleaner(inputData.attributes['autocomplete']);
    const nameAttr = textCleaner(inputData.attributes['name']);
	// // const classAttr = textCleaner(inputData.attributes['class']);
    // // const parentAutoComp = textCleaner(inputData.parentAttributes['autocomplete']);
    // // const parentClassAttr = textCleaner(inputData.parentAttributes['class']);

	const combinedText = "".concat(cleanedLabel, " ", cleanedPlaceholder, " ", ariaLabel, " ", nameAttr, " ", autoComp);

	// console.log("combinedText", combinedText);

	let email = false
	let password = false
	let phone = false
	let username = false

	keywordsMap["email"].forEach(keyword=>{
		if (combinedText.includes(keyword)) {
			email = true
		}
	})

	keywordsMap["password"].forEach(keyword=>{
		if (combinedText.includes(keyword)) {
			password = true
		}
	})

	keywordsMap["phone"].forEach(keyword=>{
		if (combinedText.includes(keyword)) {
			phone = true
		}
	})

	keywordsMap["username"].forEach(keyword=>{
		if (combinedText.includes(keyword)) {
			username = true
		}
	})

	if(email+username+phone>=1){
		return "username"
	} else if (password){
		return "password"
	}
	else {
		return null
	}

	}
}

// Takes <form> html element as input and checks if a form is of type login or signup
export function getFormType(form) {
	const passwordInputs = form.querySelectorAll('input[type="password"]');
	const emailInputs = form.querySelectorAll('input[type="email"]');
	const textInputs = form.querySelectorAll('input[type="text"]');
	const confirmPasswordInputs = form.querySelectorAll(
		'input[name*="confirm"], input[name*="Confirm"]'
	);

	if (passwordInputs.length === 0) {
		return null;
	}

	if (emailInputs.length === 0 && textInputs.length === 0) {
		return null;
	}

	// If there's a confirm password field, it's likely a signup form.
	if (confirmPasswordInputs.length > 0) {
		return "signup";
	}

	return "login";
}

export let setExpoTimeout = function (
	callback,
	initialDelay,
	maxDelay,
	maxRetries = Infinity,
	runIndefinitely = false
) {
	let retries = 0;

	function execute() {
		if (retries >= maxRetries) {
			return; // Exit if max retries reached
		}

		callback();
		retries++;
		let nextDelay = Math.min(initialDelay * 2 ** retries, maxDelay);
		if (runIndefinitely || nextDelay !== maxDelay) {
			setTimeout(execute, nextDelay);
		}
	}

	setTimeout(execute, initialDelay);
};
