import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./page/Home.jsx";
import Visualizer from "./page/Visualizer.jsx";
import Login from "./page/Login.jsx";
import Register from "./page/Register.jsx";
import VerifyEmail from "./page/VerifyEmail.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/visualizer" element={<Visualizer />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;