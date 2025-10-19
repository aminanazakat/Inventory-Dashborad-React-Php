// src/components/suppliers/Addsupplier.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddSupplier() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", cname: "", email: "", phone: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost/ims/endpoints/suppliers/add_supplier.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.status === "success" || data.message?.includes("success")) {
        setMessage("✅ supplier added!");
        setTimeout(() => navigate("/suppliers"), 1000);
      } else {
        setMessage("❌ " + (data.error || "Failed to add"));
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Error adding supplier");
    }
  };

  return (
    <div className="container-fluid">
      <div className="card-header d-flex justify-content-between align-items-center bg-warning">
                <h4 className="mb-0 m-4"> ADD SUPPLIERS</h4>
                <button className="btn btn-secondary btn-sm" onClick={() => navigate("/suppliers")}>
                  Back
                </button>
              </div>
      <div className="card shadow">
        <div className="card-body">
          {message && <div className="alert alert-info">{message}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input name="name" className="form-control" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Contact Name</label>
              <input name="contactname" className="form-control" value={formData.cname} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input name="phone" className="form-control" value={formData.phone} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-success">Save</button>
          </form>
        </div>
      </div>
    </div>
  );
}
