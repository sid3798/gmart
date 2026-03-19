import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

function CustomerPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);

  // 🔥 Fetch single customer
  useEffect(() => {
    const fetchCustomer = async () => {
      const docRef = doc(db, "customers", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setCustomer(docSnap.data());
      }
    };

    fetchCustomer();
  }, [id]);

  return (
    <div className="container">
      
      {/* 🔙 Home Button */}
      <button onClick={() => navigate("/")}>
        ⬅️ Home
      </button>

      <h2>Customer Details</h2>

      {customer ? (
        <>
          <h3>{customer.name}</h3>
          {customer.mobile && <p>📱 {customer.mobile}</p>}

          {/* 🔥 Future: Add items here */}
          <h3>🧾 Add Items (Coming Next)</h3>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default CustomerPage;