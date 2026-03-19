import { useState } from "react";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: "",
    qty: "",
    unit: "Liter",
    purchasePrice: "",
    sellingPrice: "",
    supplier: "",
  });

  // Auto margin calculation
  const margin =
    newProduct.purchasePrice && newProduct.sellingPrice
      ? (
          parseFloat(newProduct.sellingPrice) -
          parseFloat(newProduct.purchasePrice)
        ).toFixed(2)
      : "";

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.purchasePrice || !newProduct.sellingPrice) return;

    const productToSave = {
      id: Date.now(),
      name: newProduct.name,
      qty: parseFloat(newProduct.qty),
      unit: newProduct.unit,
      purchasePrice: parseFloat(newProduct.purchasePrice),
      sellingPrice: parseFloat(newProduct.sellingPrice),
      margin: parseFloat(margin),
      supplier: newProduct.supplier,
    };

    setProducts([...products, productToSave]);
    setShowForm(false);

    setNewProduct({
      name: "",
      qty: "",
      unit: "Liter",
      purchasePrice: "",
      sellingPrice: "",
      supplier: "",
    });
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const total = cart.reduce((sum, item) => sum + item.sellingPrice, 0);

  return (
    <div className="container">
      <h1>🛒 Gmart Assistant</h1>

      <button onClick={() => setShowForm(true)}>
        ➕ Add Product To Shop to 22
      </button>

      {showForm && (
        <div className="cart-section">
          <h3>Add New Product</h3>

          <input
            placeholder="Item Name"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Quantity"
            value={newProduct.qty}
            onChange={(e) =>
              setNewProduct({ ...newProduct, qty: e.target.value })
            }
          />

          <select
            value={newProduct.unit}
            onChange={(e) =>
              setNewProduct({ ...newProduct, unit: e.target.value })
            }
          >
            <option>Liter</option>
            <option>Kg</option>
            <option>Piece</option>
          </select>

          <input
            type="number"
            placeholder="Purchase Price"
            value={newProduct.purchasePrice}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                purchasePrice: e.target.value,
              })
            }
          />

          <input
            type="number"
            placeholder="Selling Price"
            value={newProduct.sellingPrice}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                sellingPrice: e.target.value,
              })
            }
          />

          <input
            placeholder="Supplier Name"
            value={newProduct.supplier}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                supplier: e.target.value,
              })
            }
          />

          <p>
            💰 Margin per {newProduct.unit}: ₹{margin}
          </p>

          <button onClick={handleAddProduct}>Save Product</button>
        </div>
      )}

      <hr />

      <input
        type="text"
        placeholder="Search product..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <h3>Products</h3>
      {filteredProducts.map((product) => (
        <div key={product.id} className="product-item">
          <span>
            {product.name} ({product.unit}) - ₹{product.sellingPrice}
          </span>
          <button onClick={() => addToCart(product)}>Add</button>
        </div>
      ))}

      <h3>🛒 Cart</h3>
      <div className="cart-section">
        {cart.map((item, index) => (
          <div key={index}>
            {item.name} - ₹{item.sellingPrice}
          </div>
        ))}
        <h2>Total: ₹{total}</h2>
      </div>
    </div>
  );
}

export default App;
