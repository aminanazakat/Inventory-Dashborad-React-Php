import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function UsersList() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);

  // Fetch Users
  const fetchUsers = async () => {
    try {
      const r = await fetch("http://localhost/ims/endpoints/users/get_users.php");
      const data = await r.json();
      setRows(data.data || []);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete User
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const r = await fetch("http://localhost/ims/endpoints/users/delete_user.php", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const res = await r.json();
      if (res.status === "success") {
        alert("✅ " + res.message);
        fetchUsers();
      } else {
        alert("❌ " + (res.message || "Failed to delete user"));
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error deleting user");
    }
  };

  return (
    <div className="container-fluid">
      <div className="card-header d-flex justify-content-between align-items-center bg-warning">
        <h4 className="mb-0 m-4">Users</h4>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate("/dashboard")}>
          Back
        </button>
      </div>

      <div className="card shadow">
        <div className="ml-4 mt-3">
          <Link to="/users/add" className="btn btn-primary">+ Add User</Link>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.full_name}</td>
                    <td>{r.email}</td>
                    <td>{r.role_name}</td>
                    <td>
                      <span className={`badge ${r.status === "active" ? "badge-success" : "badge-secondary"}`}>
                        {r.status}
                      </span>
                    </td>
                    <td>
                      <Link to={`/users/edit/${r.id}`} className="btn btn-sm btn-primary mr-2">Edit</Link>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(r.id)}>Deactivate</button>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center text-muted">No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
