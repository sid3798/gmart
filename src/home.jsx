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

const handleTouchStart = (e) => {
  setTouchStartX(e.targetTouches[0].clientX);
  setTouchStartY(e.targetTouches[0].clientY);
};

const handleTouchEnd = (cust) => {
  const deltaX = touchStartX - touchEndX;
  const deltaY = Math.abs(touchStartY - e.changedTouches[0].clientY);

  // 👉 ignore vertical scroll
  if (deltaY > 50) return;

  if (deltaX > 100) {
    startEdit(cust);
  }

  if (deltaX < -100) {
    deleteCustomer(cust.id);
  }
};

function Home() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editMobile, setEditMobile] = useState("");

  const [touchStartY, setTouchStartY] = useState(0);

  

  // 🔥 Swipe states
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

  // 🔥 Fetch data
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "customers"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setCustomers(data);
    });

    return () => unsubscribe();
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




const handleTouchEnd = (e, cust) => {
  const endX = e.changedTouches[0].clientX;
  const distance = endX - touchStartX;

  if (distance > 80) {
    // 👉 swipe RIGHT
    setSwipedId(cust.id);
  }
};


  // 🔥 Delete
  const deleteCustomer = async (id) => {
    if (!window.confirm("Delete this customer?")) return;
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

  // 🔥 Swipe handlers
  const handleTouchStart = (e) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

const [swipedId, setSwipedId] = useState(null);

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
      {/* 🔍 Search */}
      <input
        placeholder="🔍 Search customer..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <h3>Customers</h3>

      {customers.length === 0 && <p>No customers yet</p>}

      {customers.length > 0 && filteredCustomers.length === 0 && (
        <p>❌ No results for "{search}"</p>
      )}

      {/* 🔥 Customer Cards */}
      {filteredCustomers.map((cust) => (
        <div
          key={cust.id}
          className="customer-card"
          onClick={() => navigate(`/customer/${cust.id}`)}
          onTouchStart={handleTouchStart}
          
onTouchEnd={(e) => handleTouchEnd(e, cust)}
        >
          {editingId === cust.id ? (
            <div className="edit-mode">
              <input
                className="edit-input"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
              <input
                className="edit-input"
                value={editMobile}
                onChange={(e) => setEditMobile(e.target.value)}
              />

              <div className="edit-actions">
                <button
                  className="save-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    saveEdit(cust.id);
                  }}
                >
                  Save
                </button>

                <button
                  className="cancel-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingId(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="card-header">
                <div>
                  <h4>{cust.name}</h4>
                  {cust.mobile && <p>📱 {cust.mobile}</p>}
                </div>

                
              </div>

              <div className="card-actions">
               {/* Default view */}
{swipedId !== cust.id && (
  <div className="card-actions">
    
  </div>
)}

{/* Swiped view */}
{swipedId === cust.id && (
  <div className="card-actions">
    <button
      className="edit-btn"
      onClick={(e) => {
        e.stopPropagation();
        startEdit(cust);
      }}
    >
      ✏️ Edit
    </button>
  

    <button
      className="delete-btn"
      onClick={(e) => {
        e.stopPropagation();
        deleteCustomer(cust.id);
      }}
    >
      🗑 Delete
    </button>
    
  </div>
)}
              </div>
            </>
          )}
        </div>
      ))}

      {/* ➕ Add Customer */}
      <div className="cart-section">
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
    </div>
  );

  
}



export default Home;