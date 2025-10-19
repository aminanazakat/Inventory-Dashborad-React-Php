import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CreatePurchase() {
  const navigate = useNavigate();

  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [items, setItems] = useState([{ product_id: "", quantity: 1, unit_cost: 0, total: 0 }]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [createdBy, setCreatedBy] = useState(null); // login user id
  const [message, setMessage] = useState("");

  // Load suppliers + products + user
  useEffect(() => {
    fetch("http://localhost/ims/endpoints/suppliers/get_suppliers.php")
      .then((res) => res.json())
      .then((data) => setSuppliers(data.data || []))
      .catch(() => setSuppliers([]));

    fetch("http://localhost/ims/endpoints/products/get_products.php")
      .then((res) => res.json())
      .then((data) => setProducts(data.data || []))
      .catch(() => setProducts([]));

    // ✅ get logged-in user
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.id) setCreatedBy(user.id);
  }, []);

  const handleAddItem = () => {
    setItems([...items, { product_id: "", quantity: 1, unit_cost: 0, total: 0 }]);
  };

  const handleItemChange = (idx, field, value) => {
    const newItems = [...items];
    newItems[idx][field] = value;

    if (field === "product_id") {
      const product = products.find((p) => String(p.id) === String(value));
      newItems[idx].unit_cost = product ? parseFloat(product.unit_price) : 0; // take price from DB
    }

    newItems[idx].total = newItems[idx].unit_cost * newItems[idx].quantity;
    setItems(newItems);

    // recalc grand total
    const total = newItems.reduce((sum, item) => sum + item.total, 0);
    setGrandTotal(total);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!createdBy) {
      alert("❌ No user found in localStorage");
      return;
    }

    const payload = {
      supplier_id: selectedSupplier,
      order_date: new Date().toISOString().slice(0, 10),
      created_by: createdBy,
      items: items.map((i) => ({
        product_id: i.product_id,
        quantity: parseInt(i.quantity, 10),
        unit_cost: parseFloat(i.unit_cost),
        discount: 0,
        tax_rate: 0,
        total: parseFloat(i.total),
      })),
    };

    console.log("📤 Purchase Payload:", payload);

    const res = await fetch("http://localhost/ims/endpoints/purchases/create_purchase_order.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setMessage(data.message || data.error);

    if (data.success) {
      setSelectedSupplier("");
      setItems([{ product_id: "", quantity: 1, unit_cost: 0, total: 0 }]);
      setGrandTotal(0);
      setTimeout(() => navigate("/purchases"), 1500);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-header d-flex justify-content-between align-items-center bg-warning">
          <h4 className="mb-0 m-4">CREATE PURCHASE</h4>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate("/purchases")}>
            Back
          </button>
        </div>

        {message && <div className="alert alert-info m-3">{message}</div>}

        <form onSubmit={handleSubmit} className="m-4">
          <div className="form-group">
            <label>Supplier</label>
            <select
              className="form-control"
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
              required
            >
              <option value="">-- Select Supplier --</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <h5 className="mt-3">Items</h5>
          {items.map((item, idx) => (
            <div key={idx} className="d-flex gap-2 mb-2 align-items-center">
              <select
                className="form-control"
                value={item.product_id}
                onChange={(e) => handleItemChange(idx, "product_id", e.target.value)}
                required
              >
                <option value="">-- Product --</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="1"
                className="form-control"
                value={item.quantity}
                onChange={(e) => handleItemChange(idx, "quantity", parseInt(e.target.value) || 1)}
              />

              <input type="number" className="form-control" value={item.unit_cost} readOnly />
              <input type="number" className="form-control" value={item.total} readOnly />
            </div>
          ))}

          <button type="button" className="btn btn-secondary mb-3" onClick={handleAddItem}>
            + Add Product
          </button>

          <div className="mb-3">
            <strong>Grand Total: </strong>{grandTotal}
          </div>

          <button type="submit" className="btn btn-success">Save Purchase</button>
        </form>
      </div>
    </div>
  );
}
