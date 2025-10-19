import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DeliverSale() {
  const navigate = useNavigate();

  const [salesOrders, setSalesOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState("");
  const [deliveredBy, setDeliveredBy] = useState("");
  const [deliverers, setDeliverers] = useState([]);

  useEffect(() => {
    loadOrders();

    // ✅ fetch only Admin & Sales Managers
    fetch("http://localhost/ims/endpoints/users/get_deliverers.php")
      .then(res => res.json())
      .then(data => setDeliverers(data.data || []))
      .catch(() => setDeliverers([]));
  }, []);

  const loadOrders = () => {
    fetch("http://localhost/ims/endpoints/sales/get_sales_orders.php")
      .then(res => res.json())
      .then(data => setSalesOrders(Array.isArray(data) ? data : (data.data || [])))
      .catch(err => console.error("Error fetching sales orders:", err));
  };

  const handleDeliver = () => {
  if (!selectedOrder || !deliveredBy) {
    alert("Please select order and deliverer");
    return;
  }

  fetch("http://localhost/ims/endpoints/sales/deliver_sales_order.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sales_order_id: selectedOrder,
      delivered_by: deliveredBy
    })
  })
    .then(res => res.json())
    .then(data => {
      console.log("Deliver response:", data); // ✅ debug log
      alert(data.message || "No message from server");
      if (data.success) {
        loadOrders();
        setSelectedOrder("");
        setDeliveredBy("");
      }
    })
    .catch(err => {
      console.error("Error delivering sale:", err);
      alert("❌ Error delivering sale");
    });
};


  return (
    <div className="container mt-2 p-4">
      <div className="card shadow p-4">
        <div className="card-header d-flex justify-content-between align-items-center bg-warning">
          <h4 className="m-4 mb-2">DELIVER SALE</h4>
          <button className="btn btn-dark btn-sm" onClick={() => navigate("/sales")}>
            Back
          </button>
        </div>

        {/* Select Order */}
        <div className="m-3">
          <label>Select Order</label>
          <select
            className="form-control"
            value={selectedOrder}
            onChange={e => setSelectedOrder(e.target.value)}
          >
            <option value="">Select Order</option>
            {salesOrders
              .filter(o => o.status !== "delivered") // ✅ only pending orders
              .map(o => (
                <option key={o.id} value={o.id}>
                  Order #{o.id} - {o.customer_name}
                </option>
              ))}
          </select>
        </div>

        {/* Select Deliverer */}
        <div className="m-3">
          <label>Delivered By</label>
          <select
            className="form-control"
            value={deliveredBy}
            onChange={e => setDeliveredBy(e.target.value)}
            required
          >
            <option value="">Select Deliverer</option>
            {deliverers.map(d => (
              <option key={d.id} value={d.id}>
                {d.full_name} ({d.role_name})
              </option>
            ))}
          </select>
        </div>

        <button className="btn btn-success m-5" onClick={handleDeliver}>
          Mark as Delivered
        </button>
      </div>
    </div>
  );
}
