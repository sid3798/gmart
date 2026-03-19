import { useEffect, useState } from "react";
import "./App.css";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";

function App() {
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");

  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editMobile, setEditMobile] = useState("");


  const deleteCustomer = async (id) => {
    const confirmDelete = window.confirm("Are you sure to delete?");

    if (!confirmDelete) return;

    await deleteDoc(doc(db, "customers", id));
  };

  const startEdit = (cust) => {
    setEditingId(cust.id);
    setEditName(cust.name);
    setEditMobile(cust.mobile || "");
  };


  const saveEdit = async (id) => {
  if (!editName.trim()) {
    alert("Name cannot be empty");
    return;
  }

  await updateDoc(doc(db, "customers", id), {
    name: editName,
    mobile: editMobile
  });

  setEditingId(null);
};

const handleAddItem = (cust) => {
  // later we will route this page
  console.log("Go to customer page:", cust);
};



  // 🔥 Add customer (with optional mobile)
  const addCustomer = async () => {
    if (!name.trim()) {
      alert("Enter customer name");
      return;
    }

    await addDoc(collection(db, "customers"), {
      name: name,
      mobile: mobile || "", // optional
      createdAt: new Date()
    });

    setName("");
    setMobile("");
  };

  // 🔥 Real-time fetch
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "customers"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCustomers(data);
    });

    return () => unsubscribe();
  }, []);

  const filteredCustomers = customers.filter((cust) =>
    cust.name.toLowerCase().includes(search.toLowerCase()) ||
    (cust.mobile && cust.mobile.includes(search))
  );

  return (
    <div className="container">
      <h5>🧾 Khata Assistant</h5>

      {/* 👉 Input Section */}


      <div className="cart-section">

        <input
          type="text"
          placeholder="🔍 Search customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <input
          type="text"
          placeholder="Enter customer name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Mobile (optional)"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />

        <button onClick={addCustomer}>
          ➕ Add Customer
        </button>
      </div>






      <h2>Customers</h2>

      {/* 👉 No data at all */}
      {customers.length === 0 && <p>No customers yet</p>}

      {/* 👉 No search results */}
      {customers.length > 0 && filteredCustomers.length === 0 && (
        <p style={{ color: "gray" }}>
          ❌ No results for "<strong>{search}</strong>"
        </p>
      )}




      {/* 👉 Show list */}
     {filteredCustomers.map((cust) => (
  <div key={cust.id} className="product-item">
    
    {editingId === cust.id ? (
      <>
        <input
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
        />

        <input
          value={editMobile}
          onChange={(e) => setEditMobile(e.target.value)}
        />

        <button onClick={() => saveEdit(cust.id)}>💾 Save</button>
        <button onClick={() => setEditingId(null)}>❌ Cancel</button>
      </>
    ) : (
      <>
        <div>
          <strong>{cust.name}</strong>
          {cust.mobile && (
            <div style={{ fontSize: "12px", color: "gray" }}>
              📱 {cust.mobile}
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: "8px", marginTop: "5px" }}>
          <button onClick={() => handleAddItem(cust)}>➕ Add Item</button>

          <button onClick={() => startEdit(cust)}>✏️ Edit</button>

          <button onClick={() => deleteCustomer(cust.id)}>🗑 Delete</button>
        </div>
      </>
    )}
    
  </div>
))}






    </div>
  );


}

export default App;