import React from "react";

export default function ReportTable({ data, reportType }) {
  if (!data || !data.length) return <p className="text-muted">No data available</p>;

  let columns = [];

  if (reportType === "sales") {
    columns = [
      { header: "Invoice", key: "invoice" },
      { header: "Customer", key: "customer" },
      { header: "Date", key: "date" },
      { header: "Amount", key: "amount" },
      { header: "Status", key: "status" },
    ];
  }

  if (reportType === "purchase") {
    columns = [
      { header: "PO #", key: "po_number" }, // match backend column
      { header: "Supplier", key: "supplier" },
      { header: "Date", key: "date" },
      { header: "Amount", key: "amount" },
      { header: "Status", key: "status" },
    ];
  }

  if (reportType === "stock") {
    columns = [
      { header: "SKU", key: "sku" },
      { header: "Product", key: "product_name" }, // match backend alias
      { header: "On Hand", key: "qty_on_hand" },
      { header: "Reorder Level", key: "reorder_level" },
    ];
  }

  return (
    <table className="table table-bordered mt-3">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx}>
            {columns.map((col) => (
              <td key={col.key}>{row[col.key] ?? "-"}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
