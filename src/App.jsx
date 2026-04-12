import { Routes, Route } from "react-router-dom";
import Home from "./home";
import CustomerPage from "./CustomerPage";
import Calculator from "./calculator"; // New import

import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/customer/:id" element={<CustomerPage />} />
      <Route path="/calculator" element={<Calculator />} />
    </Routes>
  );
}

export default App;