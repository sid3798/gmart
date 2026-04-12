import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Calculator() {
  const navigate = useNavigate();

  const [baseQty, setBaseQty] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [target, setTarget] = useState("");
  const [mode, setMode] = useState("price");

  const rate =
    baseQty && basePrice ? parseFloat(basePrice) / parseFloat(baseQty) : 0;

  let result = 0;

  if (rate > 0 && target) {
    result =
      mode === "price"
        ? parseFloat(target) * rate
        : parseFloat(target) / rate;
  }

  return (
    <div className="calc-wrapper">
      <div className="calc-card">
        
        {/* Header */}
        <div className="calc-header">
          <button onClick={() => navigate(-1)}>⬅</button>
          <h2>Rate Calculator</h2>
        </div>

        {/* Base Inputs */}
        <div className="input-group">
          <input
            type="number"
            value={baseQty}
            onChange={(e) => setBaseQty(e.target.value)}
            required
          />
          <label>Base Qty (g)</label>
        </div>

        <div className="input-group">
          <input
            type="number"
            value={basePrice}
            onChange={(e) => setBasePrice(e.target.value)}
            required
          />
          <label>Base Price (₹)</label>
        </div>

        {/* Toggle */}
        <div className="toggle">
          <button
            className={mode === "price" ? "active" : ""}
            onClick={() => setMode("price")}
          >
            Get Price
          </button>
          <button
            className={mode === "quantity" ? "active" : ""}
            onClick={() => setMode("quantity")}
          >
            Get Qty
          </button>
        </div>

        {/* Target Input */}
        <div className="input-group">
          <input
            type="number"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            required
          />
          <label>
            {mode === "price" ? "Enter Qty (g)" : "Enter Price (₹)"}
          </label>
        </div>

        

        {/* Result */}
        <div className="result">
          {mode === "price"
            ? `₹ ${result ? result.toFixed(2) : "0.00"}`
            : `${result ? result.toFixed(2) : "0.00"} g`}
        </div>
      </div>
    </div>
  );
}