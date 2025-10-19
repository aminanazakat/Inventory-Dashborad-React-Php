import React, { useEffect, useState } from "react";
import { getLowStock, getMonthlySales, getTopSellers } from "../api";
import { Bar, Doughnut } from "react-chartjs-2";
import GaugeChart from "react-gauge-chart";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title
);

export default function Dashboard() {
  const [lowStock, setLowStock] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [topSellers, setTopSellers] = useState([]);
  const [salesTarget, setSalesTarget] = useState(7000000); // later fetch from backend

  useEffect(() => {
    (async () => {
      try {
        setLowStock(await getLowStock());
        setMonthlySales(await getMonthlySales());
        setTopSellers(await getTopSellers());

        // Example backend call for sales target
        // const res = await fetch("http://localhost:5000/api/sales-target");
        // const data = await res.json();
        // setSalesTarget(data.target || 100000);
      } catch (e) {
        console.error("Dashboard data load failed", e);
      }
    })();
  }, []);

  // KPI Cards
  const kpi = {
    revenue: monthlySales.reduce(
      (sum, m) => sum + Number(m.total_sales || 0),
      0
    ),
    purchases: monthlySales.length,
    topSellersCount: topSellers.length,
    lowStockCount: lowStock.length,
  };

  // Bar Chart
  const barData = {
    labels: monthlySales.map((m) => m.month),
    datasets: [
      {
        label: "Monthly Purchases",
        data: monthlySales.map((m) => Number(m.total_sales || 0)),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Monthly Purchases" },
    },
    scales: {
      x: {
        title: { display: true, text: "Month" },
        ticks: { autoSkip: false },
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: "Total Sales" },
      },
    },
  };

  // Doughnut Chart
  const doughnutData = {
    labels: topSellers.map((t) => t.name || t.sku),
    datasets: [
      {
        label: "Revenue by Top Sellers",
        data: topSellers.map((t) => Number(t.total_sold || 0)),
        backgroundColor: [
          "#005bb5",
          "#004080",
          "#3399cc",
          "#3399ff",
          "#66ccff",
          "#a9c4e26",
        ],
      },
    ],
  };

  return (
    <div className="container-fluid">
      {/* Page Heading */}
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Dashboard</h1>
      </div>

      {/* KPI Cards */}
      <div className="row">
        <div className="col-xl-3 col-md-6 mb-4 ">
          <div className="card border-left-primary shadow h-100 py-2">
            <div className="card-body">
              <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                Revenue (This Month)
              </div>
              <div className="h5 mb-0 font-weight-bold text-gray-800">
                {kpi.revenue.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-success shadow h-100 py-2">
            <div className="card-body">
              <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                Purchases
              </div>
              <div className="h5 mb-0 font-weight-bold text-gray-800">
                {kpi.purchases}
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-info shadow h-100 py-2">
            <div className="card-body">
              <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                Top Sellers
              </div>
              <div className="h5 mb-0 font-weight-bold text-gray-800">
                {kpi.topSellersCount}
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-warning shadow h-100 py-2">
            <div className="card-body">
              <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                Low Stock Items
              </div>
              <div className="h5 mb-0 font-weight-bold text-gray-800">
                {kpi.lowStockCount}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="row">
        <div className="col-xl-8 col-lg-7 mb-4">
          <div className="card shadow h-100">
            <div className="card-header py-3 bg-primary">
              <h6 className="m-0 font-weight-bold text-white">
                Monthly Purchases
              </h6>
            </div>
            <div className="card-body">
              {monthlySales.length === 0 ? (
                <p className="text-muted m-0">No purchase data yet.</p>
              ) : (
                <Bar data={barData} options={barOptions} />
              )}
            </div>
          </div>
        </div>
        <div className="col-xl-4 col-lg-5 mb-4">
          <div className="card shadow h-100">
            <div className="card-header py-3 bg-primary ">
              <h6 className="m-0 font-weight-bold text-white">
                Revenue by Top Sellers
              </h6>
            </div>
            <div className="card-body">
              {topSellers.length === 0 ? (
                <p className="text-muted m-0">No top sellers data yet.</p>
              ) : (
                <Doughnut data={doughnutData} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Low Stock + Gauge */}
      <div className="row">
        {/* Low Stock */}
        <div className="col-lg-6 mb-4">
          <div className="card shadow h-100">
            <div className="card-header py-3 bg-primary">
              <h6 className="m-0 font-weight-bold text-white">
                Low Stock (Top 5)
              </h6>
            </div>
            <div className="card-body">
              {lowStock.slice(0, 5).map((item) => {
                const percent = Math.min(
                  (item.qty_on_hand / item.reorder_level) * 100,
                  100
                );
                return (
                  <div key={item.product_id ?? item.id} className="mb-4">
                    <div className="d-flex justify-content-between mb-1 small">
                      <span className="font-weight-bold">{item.name}</span>
                      <span className="text-muted">
                        {item.qty_on_hand} / {item.reorder_level}
                      </span>
                    </div>
                    <div className="progress" style={{ height: "10px" }}>
                      <div
                        className={`progress-bar 
                          ${percent < 30 ? "#6c8edc" : percent < 60 ? "#a9c4e2" : "#3399ff"}`}
                        role="progressbar"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {lowStock.length === 0 && (
                <p className="text-muted m-0">No low stock alerts.</p>
              )}
            </div>
          </div>
        </div>

        {/* Single Gauge - Sales vs Target */}
        <div className="col-lg-6 mb-4">
          <div className="card shadow h-100">
            <div className="card-header py-3 bg-primary">
              <h6 className="m-0 font-weight-bold text-white">
                Sales vs Target
              </h6>
            </div>
            <div className="card-body d-flex flex-column align-items-center">
              <GaugeChart
                id="sales-vs-target-gauge"
                nrOfLevels={3}
               colors={["#66CCFF", "#3399FF", "#0066CC"]} // light → medium → dark blue
                arcWidth={0.4}
                percent={salesTarget > 0 ? Math.min(kpi.revenue / salesTarget, 1) : 0}
                hideText={true}
              />

              {/* Center value */}
              <div style={{ marginTop: "-100px" }}>
                <h3 className="font-weight-bold">
                  {kpi.revenue.toLocaleString()}
                </h3>
                <small className="text-muted">Sales</small>
              </div>

              {/* Target */}
              <p className="mt-3 mb-1 text-primary">
                Target: {salesTarget.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reports Section */}
      <div className="row">
        <div className="col-lg-12 mb-4">
          <div className="card shadow h-100">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Reports</h6>
            </div>
            <div className="card-body d-flex gap-3">
              <button className="btn btn-outline-primary ml-4">
                Download Sales Report
              </button>
              <button className="btn btn-outline-success ml-4">
                Download Purchases Report
              </button>
              <button className="btn btn-outline-warning ml-4">
                Download Inventory Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
