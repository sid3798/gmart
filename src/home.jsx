import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";
import { db } from "./firebase";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editMobile, setEditMobile] = useState("");

  // 🔥 Fetch data
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "customers"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setCustomers(data);
    });

    return () => unsubscribe(); // ✅ correct cleanup
  }, []);

  // 🔥 Add
  const addCustomer = async () => {
    if (!name.trim()) {
      alert("Enter customer name");
      return;
    }

    await addDoc(collection(db, "customers"), {
      name,
      mobile: mobile || "",
      createdAt: new Date()
    });

    setName("");
    setMobile("");
  };

  // 🔥 Delete
  const deleteCustomer = async (id) => {
    if (!window.confirm("Are you sure to delete?")) return;
    await deleteDoc(doc(db, "customers", id));
  };

  // 🔥 Edit
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

  // 🔍 Filter
  const filteredCustomers = customers.filter((cust) => {
    const s = search.toLowerCase();
    return (
      cust.name?.toLowerCase().includes(s) ||
      cust.mobile?.includes(search)
    );
  });

  return (
    <div className="container">
     

      <h3>Customers</h3>

      {customers.length === 0 && <p>No customers yet</p>}

      {customers.length > 0 && filteredCustomers.length === 0 && (
        <p>❌ No results for "{search}"</p>
      )}

      {filteredCustomers.map((cust) => (
        <div key={cust.id} className="product-item">
          {editingId === cust.id ? (
            <>
              <input value={editName} onChange={(e) => setEditName(e.target.value)} />
              <input value={editMobile} onChange={(e) => setEditMobile(e.target.value)} />

              <button onClick={() => saveEdit(cust.id)}>💾 Save</button>
              <button onClick={() => setEditingId(null)}>❌ Cancel</button>
            </>
          ) : (
            <>
              <div>
                <strong>{cust.name}</strong>
                {cust.mobile && <div>📱 {cust.mobile}</div>}
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => navigate(`/customer/${cust.id}`)}>
                  ➕ Add Item
                </button>

                <button onClick={() => startEdit(cust)}>✏️ Edit</button>

                <button onClick={() => deleteCustomer(cust.id)}>🗑 Delete</button>
              </div>
            </>
          )}
        </div>
      ))}



{/* 
//start  of search and add customer section */}
      <div className="cart-section">
        <input
          placeholder="🔍 Search customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <input
          placeholder="Enter customer name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Mobile (optional)"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />

        <button onClick={addCustomer}>➕ Add</button>
      </div>

      {/* end of search and add customer section */}


    </div>
  );
}

export default Home;