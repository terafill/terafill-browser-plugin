import * as React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";


import LoginPage from "./pages/LoginPage";
import AppHome, {ItemPanel, ItemPanelIndex} from "./pages/AppHome";


function App() {
  return (
     <HashRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} index />
        <Route path="/app-home" element={<AppHome />}>
          <Route path=":id" element={<ItemPanel />} />
          <Route path="" element={<ItemPanelIndex />} index />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
