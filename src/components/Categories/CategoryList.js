import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


export default function CategoryList() {
  
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const r = await fetch("http://localhost/ims/endpoints/categories/get_categories.php");
      const data = await r.json();
      setRows(data.data || data); // support both {data:[...]} or direct array
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Delete category
  const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this category?")) return;
  try {
    const r = await fetch("http://localhost/ims/endpoints/categories/delete_category.php", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }), // 👈 send JSON body with id
    });
    const res = await r.json();
    if (res.message) {
      alert("✅ " + res.message);
      fetchCategories();
    } else {
      alert("❌ " + (res.error || "Failed to delete category"));
    }
  } catch (err) {
    console.error(err);
    alert("❌ Error deleting category");
  }
};


  return (
    <div>
        <div className="card-header d-flex justify-content-between align-items-center bg-warning">
                <h4 className="mb-0 m-4">CATEGORIES</h4>
                <button className="btn btn-secondary btn-sm" onClick={() => navigate("/dashboard")}>
                  Back
                </button>
              </div>
               
      <div className="card shadow">
         <div className="ml-4 mt-3">
              <Link to="/categories/add" className="btn btn-primary">+ Add Category</Link>
            </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>ID</th><th>Name</th><th>Parent</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id || r.category_id}>
                    <td>{r.id || r.category_id}</td>
                    <td>{r.name || r.category_name}</td>
                    <td>{r.parent_id ?? "-"}</td>
                    <td>
                      <Link to={`/categories/edit/${r.id || r.category_id}`} className="btn btn-sm btn-primary mr-2">Edit</Link>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(r.id || r.category_id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr><td colSpan="4" className="text-center text-muted">No categories.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
