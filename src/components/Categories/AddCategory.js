import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddCategory() {
  const [formData, setFormData] = useState({ name: "", parent_id: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost/ims/endpoints/categories/add_category.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.status === "success") {
        setMessage("✅ Category added!");
        setTimeout(() => navigate("/categories"), 1000);
      } else {
        setMessage("❌ " + (data.message || "Failed to add"));
      }
    } catch (err) {
      setMessage("❌ Error adding category");
    }
  };

  return (
    <div className="container-fluid">
      <div className="card-header d-flex justify-content-between align-items-center bg-warning">
          <h4 className="mb-0 m-4">ADD CATEGORY</h4>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate("/categories")}>
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
              <label>Parent ID (optional)</label>
              <input name="parent_id" className="form-control" value={formData.parent_id} onChange={handleChange} />
            </div>
            <button type="submit" className="btn btn-success">Save</button>
          </form>
        </div>
      </div>
    </div>
  );
}
