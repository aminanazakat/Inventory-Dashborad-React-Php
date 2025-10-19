import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditSale() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load sale details
  useEffect(() => {
    fetch(`http://localhost/ims/endpoints/sales/get_sales_order.php?sale_id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setSale(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching sale:", err);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "http://localhost/ims/endpoints/sales/edit_sales_order.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sales_order_id: id,
            status: sale.status, 
          }),
        }
      );

      const data = await res.json();
      alert(data.message || data.error);

      if (data.message) {
        navigate("/sales"); // back to list
      }
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (!sale) return <div className="text-center mt-5">No sale found</div>;

  return (
<div className="container mt-2 p-4">
      <div className="card shadow p-4">
       <div className="card-header d-flex justify-content-between align-items-center bg-warning">
          <h4 className="m-4 mb-2">EDIT SALE</h4>
          <button
            className="btn btn-dark btn-sm"
            onClick={() => navigate("/sales")}
          >
            Back
          </button>
        </div>
        <div className="card-body ">
          <form onSubmit={handleSubmit} className="row g-3">
            {/* Customer Name (readonly) */}
            <div className="col-md-6">
              <label className="form-label">Customer</label>
              <input
                type="text"
                className="form-control"
                value={sale.customer_name || ""}
                readOnly
              />
            </div>

            {/* Status Dropdown */}
            <div className="col-md-6">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={sale.status}
                onChange={(e) =>
                  setSale({ ...sale, status: e.target.value })
                }
              >
                <option value="pending">Pending</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="col-12 text-end">
              <button type="submit" className="btn btn-primary">
                Update Sale
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
