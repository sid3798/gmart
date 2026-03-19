import { Routes, Route } from "react-router-dom";
import Home from "./home";
import CustomerPage from "./CustomerPage";

import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/customer/:id" element={<CustomerPage />} />
    </Routes>
  );
}

export default App;