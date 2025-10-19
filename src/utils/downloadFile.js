import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ✅ correct import

// ---------------- CSV ----------------
export function downloadCSV(data, reportType) {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]).join(",");
  const rows = data.map((row) => Object.values(row).join(",")).join("\n");
  const csvContent = headers + "\n" + rows;

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, `${reportType}_report.csv`);
}

// ---------------- Excel ----------------
export function downloadExcel(data, reportType) {
  if (!data || data.length === 0) return;

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, `${reportType}_report.xlsx`);
}

// ---------------- PDF ----------------
export function downloadPDF(data, reportType) {
  if (!data || data.length === 0) return;

  const doc = new jsPDF();

  const columns = Object.keys(data[0]).map((key) => key.toUpperCase());
  const rows = data.map((row) => Object.values(row));

  autoTable(doc, {
    head: [columns],
    body: rows,
    theme: "grid",
    styles: { fontSize: 8 },
    headStyles: { fillColor: [22, 160, 133] },
  });

  doc.save(`${reportType}_report.pdf`);
}
