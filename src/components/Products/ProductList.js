import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ProductList() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [categories, setCategories] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); 
  const [search, setSearch] = useState("");

  // Fetch all products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const r = await fetch("http://localhost/ims/endpoints/products/get_products.php");
      const data = await r.json();
      setRows(data.data || []);
    } catch (err) {
      console.error("Failed to fetch products", err);
      alert("❌ Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
 const fetchCategories = async () => {
  try {
    const r = await fetch("http://localhost/ims/endpoints/categories/get_categories.php");
    const data = await r.json();
    setCategories(data.data || data.categories || data || []); 
  } catch (err) {
    console.error("Failed to fetch categories", err);
    alert("❌ Failed to load categories");
  }
};

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const r = await fetch("http://localhost/ims/endpoints/products/delete_product.php", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const res = await r.json();
      if (res.status === "success") {
        alert("✅ Product deleted");
        fetchProducts();
      } else {
        alert("❌ " + (res.error || res.message || "Failed to delete product"));
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error deleting product");
    }
  };

  // Apply filters
  const filteredRows = rows.filter((p) => {
    const matchCategory =
      filter === "all" || p.category_id?.toString() === filter.toString();
    const matchSearch =
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div>
      {/* Header */}
      <div className="card-header d-flex justify-content-between align-items-center bg-warning">
        <h4 className="mb-0 m-4">PRODUCTS</h4>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate("/dashboard")}>
          Back
        </button>
      </div>

      <div className="card shadow">
        {/* Top Controls */}
        <div className="d-flex justify-content-between align-items-center p-3">
          <Link to="/products/add" className="btn btn-primary">
            + Add Product
          </Link>

          <div className="d-flex gap-2">
            {/* Search */}
            <input
              type="text"
              className="form-control mr-4"
              placeholder="Search by Name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {/* Category Dropdown */}
            <select
              className="form-control"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="card-body">
          {loading ? (
            <p className="text-muted">Loading...</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="thead-light">
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>SKU</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((p) => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.name}</td>
                      <td>{p.sku}</td>
                      <td>{p.unit_price}</td>
                      <td>
                        {categories.find((c) => c.id === p.category_id)?.name || "—"}
                      </td>
                      <td>
                        <Link to={`/products/edit/${p.id}`} className="btn btn-sm btn-primary mr-2">
                          Edit
                        </Link>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(p.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredRows.length === 0 && (
                    <tr>
                      <td colSpan="7" className="text-center text-muted">
                        No products found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
