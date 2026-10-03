import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./page/Home.jsx";
import Visualizer from "./page/Visualizer.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/visualizer" element={<Visualizer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;