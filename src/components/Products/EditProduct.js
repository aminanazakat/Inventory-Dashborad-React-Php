// EditProduct.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProduct, updateProduct } from "../../api";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    (async () => {
      const data = await getProduct(id);
      setFormData(data || {});
    })();
  }, [id]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateProduct(formData);
      if (res.message) {
        setMessage("✅ Product updated!");
        setTimeout(() => navigate("/products"), 1000);
      } else {
        setMessage("❌ " + (res.error || "Failed to update"));
      }
    } catch {
      setMessage("❌ Failed to update product");
    }
  };

  return (
    <div className="container-fluid">
        <div className="card-header d-flex justify-content-between align-items-center bg-warning">
          <h4 className="mb-0 m-4">EDIT PRODUCTS</h4>
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
              <input name="sku" className="form-control" value={formData.sku || ""} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Name</label>
              <input name="name" className="form-control" value={formData.name || ""} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Unit Price</label>
              <input type="number" name="unit_price" className="form-control" value={formData.unit_price || ""} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-success">Update</button>
          </form>
        </div>
      </div>
    </div>
  );
}
