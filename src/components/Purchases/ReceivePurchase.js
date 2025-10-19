import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ReceivePurchase() {
  const [purchases, setPurchases] = useState([]);
  const [users, setUsers] = useState([]); // ✅ store purchase managers/admins
  const [selected, setSelected] = useState("");
  const [receivedBy, setReceivedBy] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost/ims/endpoints/purchases/get_purchase_orders_dropdown.php")
      .then((res) => res.json())
      .then((data) => setPurchases(data.data || []))
      .catch(console.error);

    // ✅ fetch purchase managers & admins
    fetch("http://localhost/ims/endpoints/users/get_receivers.php")
      .then((res) => res.json())
      .then((data) => setUsers(data.data || []))
      .catch(() => setUsers([]));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected || !receivedBy) {
      setMessage("❌ Please select purchase order and receiver.");
      return;
    }

    try {
      const res = await fetch("http://localhost/ims/endpoints/purchases/receive_purchase_order.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selected, received_by: receivedBy }),
      });
      const result = await res.json();

      if (result.status === "success") {
        setMessage("✅ Purchase received successfully!");
        setTimeout(() => navigate("/purchases"), 1200);
      } else {
        setMessage("❌ " + (result.message || "Failed to receive purchase"));
      }
    } catch (err) {
      setMessage("❌ Error while receiving purchase");
    }
  };

  return (
    <div className="container">
      <div className="card shadow">
        <div className="card-header d-flex justify-content-between align-items-center bg-warning">
          <h4 className="mb-0 m-4">RECEIVE PURCHASE</h4>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate("/purchases")}>
            Back
          </button>
        </div>
        {message && <div className="alert alert-info m-4">{message}</div>}
        <form onSubmit={handleSubmit} className="m-4">
          <div className="form-group">
            <label>Select Purchase Order</label>
            <select
              className="form-control"
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              required
            >
              <option value="">-- Select Purchase Order --</option>
              {purchases.map((po) => (
                <option key={po.id} value={po.id}>
                  {po.order_code} - {po.status} ({po.supplier_name})
                </option>
              ))}
            </select>
          </div>

          {/* ✅ Receiver */}
          <div className="form-group mt-3">
            <label>Received By</label>
            <select
              className="form-control"
              value={receivedBy}
              onChange={(e) => setReceivedBy(e.target.value)}
              required
            >
              <option value="">-- Select Receiver --</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.full_name} ({u.role_name})
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-success mt-3">
            Receive Purchase
          </button>
        </form>
      </div>
    </div>
  );
}
