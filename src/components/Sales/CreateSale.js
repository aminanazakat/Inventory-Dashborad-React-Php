import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateSale() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [items, setItems] = useState([{ product_id: "", quantity: 1, unit_price: 0, total: 0 }]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [salesManagerId, setSalesManagerId] = useState(null); // ✅ holds Sales Manager ID

  useEffect(() => {
    // Fetch customers
    fetch("http://localhost/ims/endpoints/customers/get_customers.php")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCustomers(data);
        else if (Array.isArray(data.customers)) setCustomers(data.customers);
        else setCustomers([]);
      })
      .catch(() => setCustomers([]));

    // Fetch products
    fetch("http://localhost/ims/endpoints/products/get_products.php")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setProducts(data);
        else if (Array.isArray(data.products)) setProducts(data.products);
        else if (Array.isArray(data.data)) setProducts(data.data);
        else setProducts([]);
      })
      .catch(() => setProducts([]));

    // ✅ Fetch Sales Manager ID from users table
    fetch("http://localhost/ims/endpoints/users/get_users.php")
      .then(res => res.json())
      .then(data => {
        const users = data.data || [];
        const manager = users.find(u => String(u.role_id) === "2" && u.status === "active");
        if (manager) setSalesManagerId(manager.id);
      })
      .catch(() => setSalesManagerId(null));
  }, []);

  const handleAddItem = () => {
    setItems([...items, { product_id: "", quantity: 1, unit_price: 0, total: 0 }]);
  };

  const handleItemChange = (idx, field, value) => {
    const newItems = [...items];
    newItems[idx][field] = value;

    if (field === "product_id") {
      const product = products.find(p => String(p.id) === String(value));
      newItems[idx].unit_price = product ? parseFloat(product.unit_price) : 0;
    }

    newItems[idx].total = newItems[idx].unit_price * newItems[idx].quantity;
    setItems(newItems);

    const total = newItems.reduce((sum, item) => sum + item.total, 0);
    setGrandTotal(total);
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!salesManagerId) {
    alert("❌ No Sales Manager found. Cannot create sale.");
    return;
  }

  const payload = {
    customer_id: selectedCustomer,   // ✅ fixed
    order_date: new Date().toISOString().slice(0, 10),
    created_by: salesManagerId,
    items: items.map(i => ({
      product_id: i.product_id,
      quantity: parseInt(i.quantity, 10),
      unit_price: parseFloat(i.unit_price),   // ✅ match backend
      discount: 0,
      tax_rate: 0
    }))
  };

  console.log("Payload sent to backend:", payload);

  const response = await fetch("http://localhost/ims/endpoints/sales/create_sales_order.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  alert(data.message || data.error);

  if (data.success) {
    setSelectedCustomer("");
    setItems([{ product_id: "", quantity: 1, unit_price: 0, total: 0 }]);
    setGrandTotal(0);
  }
};


  return (
    <div className="container mt-2 p-4">
      <div className="card shadow p-4">
        <div className="card-header d-flex justify-content-between align-items-center bg-warning">
          <h4 className="m-4 mb-2">CREATE SALE</h4>
          <button className="btn btn-dark btn-sm" onClick={() => navigate("/sales")}>Back</button>
        </div>

        <form onSubmit={handleSubmit} className="m-4 mb-2">
          {/* Select Customer */}
          <div className="mb-3">
            <select
              className="form-control"
              value={selectedCustomer}
              onChange={e => setSelectedCustomer(e.target.value)}
              required
            >
              <option value="">Select Customer</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Products */}
          {items.map((item, idx) => (
            <div key={idx} className="d-flex gap-2 mb-2 align-items-center">
              <select
                className="form-control"
                value={item.product_id}
                onChange={e => handleItemChange(idx, "product_id", e.target.value)}
                required
              >
                <option value="">Select Product</option>
                {products.length > 0 ? (
                  products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)
                ) : (
                  <option disabled>No products</option>
                )}
              </select>

              <input
                type="number"
                min="1"
                className="form-control"
                value={item.quantity}
                onChange={e => handleItemChange(idx, "quantity", parseInt(e.target.value) || 1)}
              />

              <input type="number" className="form-control" value={item.unit_price} readOnly />
              <input type="number" className="form-control" value={item.total} readOnly />
            </div>
          ))}

          <button type="button" className="btn btn-secondary mb-3" onClick={handleAddItem}>
            + Add Product
          </button>

          {/* Grand Total */}
          <div className="mb-3">
            <strong>Grand Total: </strong>{grandTotal}
          </div>

          <button type="submit" className="btn btn-success mb-3 d-block">
            Create Sale
          </button>
        </form>
      </div>
    </div>
  );
}
