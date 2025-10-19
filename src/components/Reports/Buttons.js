import React from "react";
import { downloadCSV, downloadExcel, downloadPDF } from "../../utils/downloadFile";


export default function Buttons({ data, reportType }) {
  if (!data || !data.length) return null;

  return (
    <div className="mb-3">
      <button
        className="btn btn-sm btn-success mr-2"
        onClick={() => downloadCSV(data, reportType)}
      >
        Download CSV
      </button>
      <button
        className="btn btn-sm btn-success mr-2"
        onClick={() => downloadExcel(data, reportType)}
      >
        Download Excel
      </button>
      <button
        className="btn btn-sm btn-success mr-2"
        onClick={() => downloadPDF(data, reportType)}
      >
        Download PDF
      </button>
    </div>
  );
}
