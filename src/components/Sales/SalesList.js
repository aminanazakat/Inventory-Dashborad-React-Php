import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Chart from "chart.js/auto";

export default function SalesList() {
const [salesData, setSalesData] = useState([]); 
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const loadSales = async () => {
    try {
      const r = await fetch("http://localhost/ims/endpoints/sales/get_sales_orders.php");
      const data = await r.json();
      setRows(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load sales:", err);
      setRows([]);
    }
  };

  useEffect(() => {
    loadSales();
  }, []);

  useEffect(() => {
  fetch("http://localhost/ims/endpoints/sales/get_sales_orders.php")
    .then(res => res.json())
    .then(data => {
      console.log("Fetched sales:", data); // 🔍 Check what you actually get
      if (Array.isArray(data)) {
        setSalesData(data);
      } else if (Array.isArray(data.sales)) {
        setSalesData(data.sales); // if backend wraps in "sales"
      } else {
        setSalesData([]); // fallback
      }
    })
    .catch(err => console.error(err));
}, []);

  // Chart.js rendering
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
              label: "Sales Amount",
              data: rows.map(r => r.total_amount),
              borderColor: "rgba(75,192,192,1)",
              backgroundColor: "rgba(75,192,192,0.2)",
              tension: 0.3,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: "top" },
            title: { display: true, text: "Sales Over Time" },
          },
        },
      });
    }
  }, [rows]);

  // Inside SalesList.js
  const handleCancel = async (saleId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      const res = await fetch(
        "http://localhost/ims/endpoints/sales/cancel_sales_order.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sales_order_id: saleId }),
        }
      );

      const data = await res.json();
      if (data.message) {
        alert(data.message);
        loadSales(); // function to reload sales list
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to cancel sale");
    }
  };
const exportPDF = () => {
  if (!Array.isArray(salesData) || salesData.length === 0) {
    alert("No sales to export!");
    return;
  }

  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("Sales Report", 14, 22);

  doc.autoTable({
    head: [["ID", "Customer", "Status", "Total", "Date"]],
    body: salesData.map(row => [
      row.id,
      row.customer_name,
      row.status,
      row.total_amount,
      row.order_date
    ]),
    startY: 30,
  });

  doc.save("sales_report.pdf");
};

  return (
    <div>
      {/* Heading */}
      <h1 className="h3 mb-4 text-gray-800 ">Sales Orders</h1>

      {/* Chart + Buttons side by side */}
      <div className="row mb-4">
        {/* Chart (60%) */}
        <div className="col-md-8">
          <div className="card shadow p-3">
            <canvas ref={chartRef}></canvas>
          </div>
        </div>

        {/* Buttons (40%) */}
        <div className="col-md-4">
          <div className="d-flex flex-column gap-3">
            <button
              className="btn btn-primary mb-4"
              onClick={() => navigate("/sales/create")}
            >
              + Create Sale
            </button>
            <button
              className="btn btn-warning mb-4"
              onClick={() => navigate("/sales/deliver")}
            >
              Deliver Sale
            </button>
            <button className="btn btn-danger mb-4" onClick={exportPDF}>
              Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Table below */}
      <div className="card shadow">
        <div className="card-body table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr className="bg-dark text-white">
                <th>ID</th>
                <th>Customer</th>
                <th>Created By</th>   
                <th>Date</th>
                <th>Total</th>
                <th>Delivered By</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.customer_name}</td>
                  <td>{r.created_by_name || "-"}</td>
                  <td>{r.order_date}</td>
                  <td>{r.total_amount}</td>
                  <td>{r.delivered_by_name || "-"}</td>
                  <td>
                    <span
                      className={`badge ${r.status === "pending" ? "bg-warning" :
                          r.status === "delivered" ? "bg-success" :
                            r.status === "cancelled" ? "bg-danger" :
                              "bg-secondary"
                        } text-white ml-2`}
                    >
                      {r.status}
                    </span>
                  </td>
            
                  
                  <td>
                    { r.status === "pending" &&  (
                      <>
                        <button
                          className="btn btn-sm btn-primary me-2"
                          onClick={() => navigate(`/sales/edit/${r.id}`)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleCancel(r.id)}
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {r.status === "delivered" && (
                      <span className="text-success">Delivered</span>
                    )}
                    {r.status === "cancelled" && (
                      <span className="text-danger">Cancelled</span>
                    )}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center text-muted">
                    No sales orders.
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
