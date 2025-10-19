// src/components/Customers/EditCustomer.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditCustomer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`http://localhost/ims/endpoints/customers/get_customer.php?id=${id}`);
        const data = await r.json();
        if (!data.error) {
          setFormData(data.data || data); // handle both wrapped or raw
        } else {
          setMessage("❌ " + data.error);
        }
      } catch (err) {
        console.error(err);
        setMessage("❌ Error fetching customer");
      }
    })();
  }, [id]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost/ims/endpoints/customers/update_customer.php?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.status === "success" || data.message?.includes("success")) {
        setMessage("✅ Customer updated!");
        setTimeout(() => navigate("/customers"), 1000);
      } else {
        setMessage("❌ " + (data.error || "Failed to update"));
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Error updating customer");
    }
  };

  return (
    <div className="container-fluid">
      <div className="card-header d-flex justify-content-between align-items-center bg-warning">
          <h4 className="mb-0 m-4">EDIT CUSTOMER</h4>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate("/customers")}>
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
              <label>Email</label>
              <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input name="phone" className="form-control" value={formData.phone} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-success">Update Customer</button>
          </form>
        </div>
      </div>
    </div>
  );
}
