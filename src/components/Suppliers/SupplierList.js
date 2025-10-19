// src/components/suppliers/CustomerList.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function SupplierList() {
    const navigate = useNavigate();
  const [rows, setRows] = useState([]);

  // Fetch suppliers
  const fetchsuppliers = async () => {
    try {
      const r = await fetch("http://localhost/ims/endpoints/suppliers/get_suppliers.php");
      const data = await r.json();
      setRows(data.data || data); // handle both {data:[]} or []
    } catch (err) {
      console.error("Failed to fetch suppliers", err);
      alert("❌ Failed to load suppliers");
    }
  };

  useEffect(() => {
    fetchsuppliers();
  }, []);

  const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this Supplier?")) return;
  try {
    const r = await fetch("http://localhost/ims/endpoints/suppliers/delete_supplier.php",{
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({id}),  
    });
    
    const res = await r.json();
    if (res.message?.includes("success")) {
      alert("✅ Supplier deleted");
      fetchsuppliers();
    } else {
      alert("❌ " + (res.error || "Failed to delete"));
    }
  } 
  catch (err) {
    console.error(err);
    console.log("amina");
    alert("❌ Error deleting Supplier");
  }
};


  return (
    <div>
       <div className="card-header d-flex justify-content-between align-items-center bg-warning">
                <h4 className="mb-0 m-4">SUPPLIERS</h4>
                <button className="btn btn-secondary btn-sm" onClick={() => navigate("/dashboard")}>
                  Back
                </button>
              </div>
     
      <div className="card shadow">
         <div className="ml-4 mt-3">
        <Link to="/suppliers/add" className="btn btn-primary">+ Add Supplier</Link>
      </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>ID</th><th>Business Name</th><th>Name</th><th>Email</th><th>Phone</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.name}</td>
                    <td>{r.contact_name}</td>
                    <td>{r.email}</td>
                    <td>{r.phone}</td>
                    <td>
                      <Link to={`/suppliers/edit/${r.id}`} className="btn btn-sm btn-primary mr-2">Edit</Link>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(r.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center text-muted">No suppliers.</td>
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
