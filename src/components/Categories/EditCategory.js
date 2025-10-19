// src/components/Categories/EditCategory.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditCategory() {
  const { id } = useParams(); // get ID from URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", parent_id: "" });
  const [message, setMessage] = useState("");

  // Fetch existing category details by ID
 useEffect(() => {
  (async () => {
    try {
      const res = await fetch(`http://localhost/ims/endpoints/categories/get_category.php?id=${id}`);
      const data = await res.json();

      if (!data.error) {
        setFormData(data);   // ✅ backend returns category directly
      } else {
        setMessage("❌ " + data.error);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Error fetching category");
    }
  })();
}, [id]);


  // Update category
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost/ims/endpoints/categories/update_category.php`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, id }),
      });
      const data = await res.json();
      if (data.message) {
        setMessage("✅ Category updated successfully!");
        setTimeout(() => navigate("/categories"), 1000);
      } else {
        setMessage("❌ " + (data.error || "Update failed"));
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Error updating category");
    }
  };

  return (
    <div className="container-fluid">
      <div className="card-header d-flex justify-content-between align-items-center bg-warning">
          <h4 className="mb-0 m-4">EDIT CATEGORY</h4>
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
              <input
                name="name"
                className="form-control"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Parent Category ID</label>
              <input
                type="number"
                name="parent_id"
                className="form-control"
                value={formData.parent_id || ""}
                onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
              />
            </div>
            <button type="submit" className="btn btn-success">Update Category</button>
          </form>
        </div>
      </div>
    </div>
  );
}
