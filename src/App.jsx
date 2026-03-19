import { useState } from "react";
import "./App.css";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

function App() {

  const addCustomer = async () => {
    try {
      await addDoc(collection(db, "customers"), {
        name: "Ramesh",
        createdAt: new Date()
      });
      alert("Customer added!");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h1>Khata Assistant</h1>

      <button onClick={addCustomer}>
        Add Customer
      </button>
    </div>
  );
}

export default App;