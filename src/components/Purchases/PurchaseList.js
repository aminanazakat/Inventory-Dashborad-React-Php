import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Chart from "chart.js/auto";
import { Pie } from "react-chartjs-2";

export default function PurchaseList() {
  const [rows, setRows] = useState([]);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const fetchPurchases = async () => {
    try {
      const r = await fetch("http://localhost/ims/endpoints/purchases/get_purchase_orders.php");
      const data = await r.json();
      setRows(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch purchases", err);
      setRows([]);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  // Line Chart (amount over time)
  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();

    if (rows.length > 0) {
      chartInstance.current = new Chart(chartRef.current, {
        type: "line",
        data: {
          labels: rows.map(r => r.order_date),
          datasets: [
            {
              label: "Purchase Amount",
              data: rows.map(r => r.total_amount),
              borderColor: "rgba(0,102,204,1)",
              backgroundColor: "rgba(0,102,204,0.2)",
              tension: 0.3,
            },
          ],
        },
        options: { responsive: true },
      });
    }
  }, [rows]);

  // Pie chart (status counts)
  const statusCounts = rows.reduce(
    (acc, r) => {
      const st = (r.status || "").toLowerCase();
      if (st === "received") acc.received++;
      else if (st === "placed") acc.placed++;
      else if (st === "cancelled") acc.cancelled++;
      return acc;
    },
    { received: 0, placed: 0, cancelled: 0 }
  );

  const pieData = {
    labels: ["Received", "Placed", "Cancelled"],
    datasets: [
      {
        data: [statusCounts.received, statusCounts.placed, statusCounts.cancelled],
        backgroundColor: ["#008AE0", "#66ccff", "#005bb5"],
      },
    ],
  };

  return (
    <div>
      <h1 className="h3 mb-3 text-gray-800">Purchase Orders</h1>

      {/* Buttons */}
      <div className="d-flex justify-content-right mb-4">
        <Link to="/purchases/create" className="btn btn-primary mr-4">
          + Create Purchase
        </Link>
        <Link to="/purchases/receive" className="btn btn-warning">
          Receive Purchase
        </Link>
      </div>

      {/* Charts Row */}

      <div className="row mb-4">
        <div className="col-md-8">
          <div className="card shadow p-3">
            <canvas ref={chartRef}></canvas>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow p-3">
            <Pie data={pieData} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card shadow">
        <div className="card-body table-responsive">
          <table className="table table-bordered">
            <thead className="bg-dark text-white">
              <tr>
                <th>ID</th>
                <th>Supplier</th>
                <th>Created By</th>
                <th>Received By</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.supplier_name}</td>
                  <td>{r.created_by_name || "-"}</td>
                  <td>{r.received_by_name || "-"}</td>
                  <td>{r.order_date}</td>
                  <td>{r.total_amount}</td>
                  <td>
                    <span
                      className={`badge ${r.status === "Received" ? "badge-success" :
                          r.status === "Cancelled" ? "badge-danger" :
                            r.status === "Placed" ? "badge-warning" :
                              "badge-secondary"
                        }`}
                    >
                      {r.status}
                    </span>
                  </td>

                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center text-muted">
                    No purchase orders.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
