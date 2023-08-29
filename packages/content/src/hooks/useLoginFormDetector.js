function useLoginFormDetector() {
	const passwordInputs = document.querySelectorAll('input[type="password"]');
	const emailInputs = document.querySelectorAll('input[type="email"]');
	const textInputs = document.querySelectorAll('input[type="text"]');

	// Check if there's at least one password input field.
	if (passwordInputs.length === 0) {
		return { hasLoginForm: false };
	}

	// Check if there's an email or text input field.
	if (emailInputs.length === 0 && textInputs.length === 0) {
		return { hasLoginForm: false };
	}

	return { hasLoginForm: true };
}

export default useLoginFormDetector;
