// AddProduct.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addProduct } from "../../api";

export default function AddProduct() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    category_id: "",
    unit: "pcs",
    unit_price: "",
    reorder_level: "",
    is_active: 1,
  });
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");

 useEffect(() => {
  (async () => {
    try {
      const res = await fetch("http://localhost/ims/endpoints/categories/get_categories.php");
      const data = await res.json();
      console.log("Categories API response:", data); // 👈 check structure in browser console
      // Some APIs return {status:"success", data:[...]}
      if (Array.isArray(data)) {
        setCategories(data);
      } else if (data.data) {
        setCategories(data.data);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  })();
}, []);


  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await addProduct(formData);
      if (res.message) {
        setMessage("✅ Product added successfully!");
        setTimeout(() => navigate("/products"), 1000);
      } else {
        setMessage("❌ " + (res.error || "Failed to add product"));
      }
    } catch (err) {
      setMessage("❌ Failed to add product");
    }
  };

  return (
    <div className="container-fluid">
     <div className="card-header d-flex justify-content-between align-items-center bg-warning">
          <h4 className="mb-0 m-4">ADD PRODUCTS</h4>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate("/products")}>
            Back
          </button>
        </div>
      <div className="card shadow">
        <div className="card-body">
          {message && <div className="alert alert-info">{message}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>SKU</label>
              <input
                name="sku"
                className="form-control"
                value={formData.sku}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Name</label>
              <input
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            {/* 🔹 Categories Dropdown */}
            <div className="form-group">
              <label>Category</label>
              <select
  name="category_id"
  className="form-control"
  value={formData.category_id}
  onChange={handleChange}
  required
>
  <option value="">-- Select Category --</option>
  {categories.map((c) => (
    <option key={c.id || c.category_id} value={c.id || c.category_id}>
      {c.name || c.category_name}
    </option>
  ))}
</select>
            </div>
            <div className="form-group">
              <label>Unit</label>
              <input
                name="unit"
                className="form-control"
                value={formData.unit}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Unit Price</label>
              <input
                type="number"
                name="unit_price"
                className="form-control"
                value={formData.unit_price}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Reorder Level</label>
              <input
                type="number"
                name="reorder_level"
                className="form-control"
                value={formData.reorder_level}
                onChange={handleChange}
              />
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
