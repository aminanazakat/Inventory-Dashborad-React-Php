// src/components/Stock/AddStock.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddStock() {
  const [form, setForm] = useState({
    product_id: "",
    qty_change: "",
    reason: "adjustment",
    created_by: 1, // hardcoded for now, can be replaced with logged-in user id
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const r = await fetch(
        "http://localhost/ims/endpoints/stock_movements/add_stock_adjustment.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const res = await r.json();

      if (res.message?.includes("successfully")) {
        alert("✅ Stock adjustment added");
        navigate("/stocks"); // go back to list
      } else {
        alert("❌ " + (res.error || "Failed to save adjustment"));
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error saving adjustment");
    }
  };

  return (
    <div>
       <div className="card-header d-flex justify-content-between align-items-center bg-warning">
                <h4 className="mb-0 m-4">Add Stock Movements</h4>
                <button className="btn btn-secondary btn-sm" onClick={() => navigate("/stock")}>
                  Back
                </button>
              </div>
      <div className="card shadow">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Product ID</label>
              <input
                type="number"
                name="product_id"
                value={form.product_id}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label>Quantity Change</label>
              <input
                type="number"
                name="qty_change"
                value={form.qty_change}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label>Reason</label>
              <select
                name="reason"
                value={form.reason}
                onChange={handleChange}
                className="form-control"
              >
                <option value="adjustment">Adjustment</option>
                <option value="purchase">Purchase</option>
                <option value="sale">Sale</option>
                <option value="return_in">Return In</option>
                <option value="return_out">Return Out</option>
              </select>
            </div>

            <button type="submit" className="btn btn-success">
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
