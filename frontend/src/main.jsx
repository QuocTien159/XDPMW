import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";           // USER
import AppAdmin from "./AppAdmin"; // ADMIN

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>

      {/* USER */}
      <Route path="/*" element={<App />} />

      {/* ADMIN */}
      <Route path="/admin/*" element={<AppAdmin />} />

    </Routes>
  </BrowserRouter>
);