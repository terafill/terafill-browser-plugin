import Fuse from "fuse.js";

// Fake data
export const dataMap = {
	username: ["johndoe", "doejohn", "johndoe93"],
	firstname: ["John"],
	lastname: ["Doe"],
	email: [
		"johndoe@gmail.com",
		"doejohn@rocketmail.com",
		"johndoe1993@gmail.com",
	],
	password: ["test@1234", "sample-password"],
	confirmpassword: ["test@1234", "sample-password"],
};

export const targetItemList = [
    {
        "username":"johndoe@gmail.com",
        "title": "Facebook"
    },
    {
        "username":"doejohn@rocketmail.com",
        "title": "Netflix"
    },
    {
        "username":"johndoe1993@gmail.com",
        "title": "Google"
    },
]

// Fields metadata
export const fieldTypes = [
	{
		type: "firstname",
		keywords: ["first", "name", "given", "firstname", "first_name"],
	},
	{
		type: "lastname",
		keywords: [
			"last",
			"name",
			"surname",
			"family",
			"lastname",
			"last_name",
		],
	},
	{ type: "username", keywords: ["user", "name", "login", "username"] },
	{ type: "password", keywords: ["password", "pass", "pwd"] },
	{ type: "email", keywords: ["email", "mail"] },
	{
		type: "confirmpassword",
		keywords: [
			"confirm",
			"password",
			"confirm_password",
			"confirmPassword",
			"verify",
		],
	},
];


const options = {
	keys: ["keywords"],
	threshold: 0.3,
	includeScore: true,
};

const fuse = new Fuse(fieldTypes, options);

// Takes <input> html element as input and identify the type of input field.
// Outputs: ["firstname", "lastname", "password", "confirmpassword"]
export function identifyFieldType(inputField) {
    
	const attributesToCheck = ["name", "id", "class", "type"];

	let bestMatch = { score: Infinity, type: "unknown" };

	attributesToCheck.forEach((attr) => {
		const query = inputField.getAttribute(attr);
		if (!query) return;

		const lowercaseQuery = query.toLowerCase();
		const result = fuse.search(lowercaseQuery);

		if (result.length > 0 && result[0].score < bestMatch.score) {
			bestMatch = { score: result[0].score, type: result[0].item.type };
		}
	});

	return bestMatch.type;
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


export function positionButton(button, inputField) {
	const rect = inputField.getBoundingClientRect();
	const horizontalSpacing = 8; // The spacing between the button and the right end of the input field

	button.style.left =
		rect.left +
		window.pageXOffset +
		rect.width -
		24 -
		horizontalSpacing +
		"px";
	button.style.top =
		rect.top + window.pageYOffset + rect.height / 2 - 24 / 2 + "px";
}

export function positionPopup(popup, inputField) {
	// Position the popup relative to the input field
	const rect = inputField.getBoundingClientRect();
	popup.style.left = rect.left + window.pageXOffset + "px";
	popup.style.top = rect.top + rect.height + window.pageYOffset + "px";
}

export function hasLoginForm() {
	const passwordInputs = document.querySelectorAll('input[type="password"]');
	const emailInputs = document.querySelectorAll('input[type="email"]');
	const textInputs = document.querySelectorAll('input[type="text"]');

	// Check if there's at least one password input field.
	if (passwordInputs.length === 0) {
		return false;
	}

	// Check if there's an email or text input field.
	if (emailInputs.length === 0 && textInputs.length === 0) {
		return false;
	}

	return true;
}