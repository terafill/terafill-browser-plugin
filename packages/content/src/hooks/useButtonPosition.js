import { useEffect, useState } from "react";

export function useButtonPosition(inputField) {
	const [position, setPosition] = useState({ top: "0px", left: "0px" });

	useEffect(() => {
		const updatePosition = () => {
			if (inputField) {
				const rect = inputField.getBoundingClientRect();
				const horizontalSpacing = 8;
				const left =
					rect.left +
					window.pageXOffset +
					rect.width -
					24 -
					horizontalSpacing +
					"px";
				const top =
					rect.top +
					window.pageYOffset +
					rect.height / 2 -
					24 / 2 +
					"px";
				setPosition({ top, left });
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

export default useButtonPosition;