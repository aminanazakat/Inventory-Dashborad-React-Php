// src/components/Customers/CustomerList.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {useNavigate } from "react-router-dom";



export default function CustomerList() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);

  // Fetch customers
  const fetchCustomers = async () => {
    try {
      const r = await fetch("http://localhost/ims/endpoints/customers/get_customers.php");
      const data = await r.json();
      setRows(data.data || data); // handle both {data:[]} or []
    } catch (err) {
      console.error("Failed to fetch customers", err);
      alert("❌ Failed to load customers");
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this customer?")) return;
  try {
    const r = await fetch("http://localhost/ims/endpoints/customers/delete_customer.php", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),   // ✅ send JSON body
    });
    const res = await r.json();
    if (res.message?.includes("success")) {
      alert("✅ Customer deleted");
      fetchCustomers();
    } else {
      alert("❌ " + (res.error || "Failed to delete"));
    }
  } catch (err) {
    console.error(err);
    alert("❌ Error deleting customer");
  }
};


  return (
    <div>
        <div className="card-header d-flex justify-content-between align-items-center bg-warning">
          <h4 className="mb-0 m-4">CUSTOMERS</h4>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate("/dashboard")}>
            Back
          </button>
        </div>
     
      <div className="card shadow">
          <div className="ml-4 mt-3">
        <Link to="/customers/add" className="btn btn-primary">+ Add Customer</Link>
      </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr className="bg-dark text-white">
                  <th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.name}</td>
                    <td>{r.email}</td>
                    <td>{r.phone}</td>
                    <td>
                      <Link to={`/customers/edit/${r.id}`} className="btn btn-sm btn-primary mr-2">Edit</Link>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(r.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center text-muted">No customers.</td>
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
