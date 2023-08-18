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
		username: "johndoe@gmail.com",
		title: "Facebook",
	},
	{
		username: "doejohn@rocketmail.com",
		title: "Netflix",
	},
	{
		username: "johndoe1993@gmail.com",
		title: "Google",
	},
];

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
