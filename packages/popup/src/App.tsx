// @ts-nocheck

import { createHashRouter, RouterProvider } from "react-router-dom";

import AppHome, { ItemPanel, ItemPanelIndex } from "./pages/app/AppHome";
import LoginPage from "./pages/auth/LoginPage";

const router = createHashRouter([
	{
		path: "/app",
		children: [
			{
				// index: true,
				path: "home",
				element: <AppHome />,
				children: [
					{
						path: ":id",
						element: <ItemPanel />,
					},
					{
						index: true,
						element: <ItemPanelIndex />,
					},
				],
			},
		],
	},
	{
		path: "/",
		element: <LoginPage />,
		index: true,
	},
]);

function App() {
	return <RouterProvider router={router} />;
}
export default App;
