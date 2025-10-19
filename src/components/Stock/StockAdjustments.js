// src/components/Stock/StockMovements.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function StockMovements() {
   const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState("all");

  // Fetch stock movements
  const fetchStockMovements = async () => {
    try {
      const r = await fetch("http://localhost/ims/endpoints/stock_movements/get_stock_movements.php");
      const data = await r.json();
      setRows(data.data || data); // handle both {data:[]} or []
    } catch (err) {
      console.error("Failed to fetch stock movements", err);
      alert("❌ Failed to load stock movements");
    }
  };

  useEffect(() => {
    fetchStockMovements();
  }, []);

  // Apply filter
  const filteredRows =
    filter === "all" ? rows : rows.filter((r) => r.reason === filter);

  // Render quantity with colors
  const renderQty = (qty) => {
    return (
      <span className={qty > 0 ? "text-success font-weight-bold" : "text-danger font-weight-bold"}>
        {qty > 0 ? `+${qty}` : qty}
      </span>
    );
  };

  return (
    <div>
       <div className="card-header d-flex justify-content-between align-items-center bg-warning">
                <h4 className="mb-0 m-4">Stock Movements</h4>
                <button className="btn btn-secondary btn-sm" onClick={() => navigate("/dashboard")}>
                  Back
                </button>
              </div>
      
      {/* Actions */}
      <div className="d-flex mb-3 mt-3">
        <Link to="/Stock/add" className="btn btn-primary mr-2">
          + Add Stock Adjustment
        </Link>

        <select
          className="form-control w-auto"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="purchase">Purchase</option>
          <option value="sale">Sale</option>
          <option value="adjustment">Adjustment</option>
        </select>
      </div>

      {/* Table */}
      <div className="card shadow">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="thead-light">
                <tr>
                  <th>ID</th>
                  <th>Product</th>
                  <th>Qty Change</th>
                  <th>Reason</th>
                  <th>Reference</th>
                  <th>User</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.product_name || r.product_id}</td>
                    <td>{renderQty(r.qty_change)}</td>
                    <td>
                      <span className="badge badge-info text-uppercase">{r.reason}</span>
                    </td>
                    <td>
                      {r.reference_type} #{r.reference_id}
                    </td>
                    <td>{r.created_by_name || r.created_by}</td>
                    <td>{new Date(r.created_at).toLocaleString()}</td>
                  </tr>
                ))}
                {filteredRows.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center text-muted">
                      No stock movements found.
                    </td>
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
