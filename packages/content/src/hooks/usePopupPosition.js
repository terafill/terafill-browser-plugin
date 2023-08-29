import { useEffect, useState } from "react";

export function usePopupPosition(inputField) {
	const [position, setPosition] = useState({ top: 0, left: 0 });

	useEffect(() => {
		const updatePosition = () => {
			if (inputField) {
				const rect = inputField.getBoundingClientRect();
				setPosition({
					left: rect.left + window.pageXOffset,
					top: rect.top + rect.height + window.pageYOffset,
				});
			}
		};
		updatePosition();

		window.addEventListener("resize", updatePosition);
		window.addEventListener("scroll", updatePosition);

		// Clean up listeners when component unmounts
		return () => {
			window.removeEventListener("resize", updatePosition);
			window.removeEventListener("scroll", updatePosition);
		};
	}, [inputField]);

	return position;
}

export default usePopupPosition;