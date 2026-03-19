import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  updateDoc
} from "firebase/firestore";
import { db } from "./firebase";

function CustomerPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);

  const [itemName, setItemName] = useState("");
  const [amount, setAmount] = useState("");
  const [entries, setEntries] = useState([]);

  // 🔥 edit states
  const [editId, setEditId] = useState(null);
  const [editItem, setEditItem] = useState("");
  const [editAmount, setEditAmount] = useState("");

  // 🔥 Fetch customer
  useEffect(() => {
    const fetchCustomer = async () => {
      const docSnap = await getDoc(doc(db, "customers", id));
      if (docSnap.exists()) setCustomer(docSnap.data());
    };
    fetchCustomer();
  }, [id]);

  // 🔥 Fetch entries realtime
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "customers", id, "entries"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setEntries(data);
      }
    );
    return () => unsubscribe();
  }, [id]);

  // 🔥 Add item
  const handleSave = async () => {
    if (!itemName.trim() || !amount) return alert("Enter details");

    await addDoc(collection(db, "customers", id, "entries"), {
      itemName,
      amount: Number(amount),
      date: new Date().toLocaleDateString("en-GB"), // ✅ proper date
      paid: false,
      createdAt: new Date()
    });

    setItemName("");
    setAmount("");
  };

  // 🔥 Toggle payment
  const togglePayment = async (entry) => {
    await updateDoc(doc(db, "customers", id, "entries", entry.id), {
      paid: !entry.paid
    });
  };

  // 🔥 Delete
  const deleteEntry = async (entryId) => {
    if (!window.confirm("Delete entry?")) return;
    await deleteDoc(doc(db, "customers", id, "entries", entryId));
  };

  // 🔥 Start edit
  const startEdit = (entry) => {
    setEditId(entry.id);
    setEditItem(entry.itemName);
    setEditAmount(entry.amount);
  };

  // 🔥 Save edit
  const saveEdit = async (entryId) => {
    if (!editItem || !editAmount) return;

    await updateDoc(doc(db, "customers", id, "entries", entryId), {
      itemName: editItem,
      amount: Number(editAmount)
    });

    setEditId(null);
  };

  // 🔥 Total (exclude paid)
  const total = entries
    .filter((e) => !e.paid)
    .reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="container">

      <button onClick={() => navigate("/")}>⬅️ Home</button>

      {customer ? (
        <>
          <h2>{customer.name}</h2>

          {/* INPUT */}
          <div className="cart-section">
            <input
              placeholder="Item name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button onClick={handleSave} className="main-save">
  💾 Save
</button>
          </div>

          {/* TABLE */}
          <div className="table-wrapper">
            <table className="khata-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Item</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>

              <tbody>
                {entries.map((e) => (
                  <tr key={e.id}>
                    <td>{e.date}</td>

                    {/* EDIT MODE */}



                    {editId === e.id ? (
  <>
    <td>
      <input
        className="edit-input"
        value={editItem}
        onChange={(ev) => setEditItem(ev.target.value)}
      />
    </td>

    <td>
      <input
        className="edit-input"
        type="number"
        value={editAmount}
        onChange={(ev) => setEditAmount(ev.target.value)}
      />
    </td>

    <td colSpan="3">
      <div className="edit-actions">
        <button
          className="save-btn"
          onClick={() => saveEdit(e.id)}
        >
          💾
        </button>

        <button
          className="cancel-btn"
          onClick={() => setEditId(null)}
        >
          ✖
        </button>
      </div>
    </td>
  </>
) : (
                      <>
                        <td>{e.itemName}</td>
                        <td>{e.amount}</td>

                        <td>
                          <div>
  <label className="switch">
    <input
      type="checkbox"
      checked={e.paid}
      onChange={() => togglePayment(e)}
    />
    <span className="slider"></span>
  </label>
  <div style={{ fontSize: "10px" }}>
    {e.paid ? "Paid" : "Pending"}
  </div>
</div>
                        </td>

                        <td>
                          <button onClick={() => startEdit(e)}>✏️</button>
                        </td>

                        <td>
                          <button onClick={() => deleteEntry(e.id)}>🗑</button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}

                {/* TOTAL */}
                <tr className="total-row">
                  <td colSpan="2"><strong>Total</strong></td>
                  <td><strong>{total}</strong></td>
                  <td colSpan="3"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default CustomerPage;