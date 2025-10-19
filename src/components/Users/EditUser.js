import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    role_id: "",
    status: "active",
  });
  const [roles, setRoles] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch roles
  useEffect(() => {
    fetch("http://localhost/ims/endpoints/users/get_roles.php")
      .then((r) => r.json())
      .then((data) => setRoles(data.data || []))
      .catch((err) => console.error("Failed to fetch roles", err));
  }, []);

  // Fetch user by ID
  useEffect(() => {
    fetch("http://localhost/ims/endpoints/users/get_users.php")
      .then((r) => r.json())
      .then((data) => {
        const user = (data.data || []).find((u) => u.id === parseInt(id));
        if (user) setFormData(user);
      })
      .catch((err) => console.error("Failed to fetch user", err));
  }, [id]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost/ims/endpoints/users/update_user.php", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.status === "success") {
        setMessage("✅ User updated!");
        setTimeout(() => navigate("/users"), 1000);
      } else {
        setMessage("❌ " + (data.message || "Failed to update user"));
      }
    } catch (err) {
      setMessage("❌ Error updating user");
    }
  };

  return (
    <div className="container-fluid">
      <div className="card-header d-flex justify-content-between align-items-center bg-warning">
        <h4 className="mb-0 m-4">Edit User</h4>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate("/users")}>
          Back
        </button>
      </div>

      <div className="card shadow">
        <div className="card-body">
          {message && <div className="alert alert-info">{message}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input name="full_name" className="form-control" value={formData.full_name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select name="role_id" className="form-control" value={formData.role_id} onChange={handleChange} required>
                <option value="">Select Role</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select name="status" className="form-control" value={formData.status} onChange={handleChange}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <button type="submit" className="btn btn-success">Update</button>
          </form>
        </div>
      </div>
    </div>
  );
}
