import React, { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import { getSalesReport, getPurchaseReport, getStockReport } from "../../api";
import ReportTable from "./ReportTable";
import Buttons from "./Buttons";

export default function Reports() {
  const [activeReport, setActiveReport] = useState("sales");
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchReport(activeReport);
  }, [activeReport]);

  const fetchReport = async (reportType) => {
    try {
      if (reportType === "sales") {
        setData(await getSalesReport());
      } else if (reportType === "purchase") {
        setData(await getPurchaseReport());
      } else if (reportType === "stock") {
        setData(await getStockReport());
      }
    } catch (err) {
      console.error("Failed to fetch report:", err);
      setData([]);
    }
  };

  const reportLabels = {
    sales: "Sales Report",
    purchase: "Purchase Report",
    stock: "Stock Report",
  };

  return (
    <div>
      <h1 className="h3 mb-4 text-gray-800">Reports</h1>

      {/* Report Switch Buttons */}
      <div className="mb-4">
        {Object.keys(reportLabels).map((key) => (
          <button
            key={key}
            className={`btn mr-2 ${
              activeReport === key ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setActiveReport(key)}
          >
            {reportLabels[key]}
          </button>
        ))}
      </div>

      {/* Download buttons */}
      <Buttons data={data} reportType={activeReport} />

      {/* Report Table */}
      <ReportTable data={data} reportType={activeReport} />
    </div>
  );
}
