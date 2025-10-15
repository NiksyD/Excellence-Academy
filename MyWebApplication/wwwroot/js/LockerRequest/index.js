// Locker Request Management JavaScript Functions

// Search functionality
document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchInput");
  const statusFilter = document.getElementById("statusFilter");
  const semesterFilter = document.getElementById("semesterFilter");

  function filterTable() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : "";
    const selectedStatus = statusFilter ? statusFilter.value.toLowerCase() : "";
    const selectedSemester = semesterFilter
      ? semesterFilter.value.toLowerCase()
      : "";
    const table = document.querySelector("table");

    if (table) {
      const rows = table
        .getElementsByTagName("tbody")[0]
        .getElementsByTagName("tr");

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const text = row.textContent.toLowerCase();
        const statusCell = row.cells[5].textContent.toLowerCase();
        const semesterCell = row.cells[4].textContent.toLowerCase();

        const matchesSearch = searchTerm === "" || text.includes(searchTerm);
        const matchesStatus =
          selectedStatus === "" || statusCell.includes(selectedStatus);
        const matchesSemester =
          selectedSemester === "" || semesterCell.includes(selectedSemester);

        row.style.display =
          matchesSearch && matchesStatus && matchesSemester ? "" : "none";
      }
    }
  }

  if (searchInput) {
    searchInput.addEventListener("keyup", filterTable);
  }

  if (statusFilter) {
    statusFilter.addEventListener("change", filterTable);
  }

  if (semesterFilter) {
    semesterFilter.addEventListener("change", filterTable);
  }
});

// Export to CSV functionality
function exportToCSV() {
  const table = document.querySelector("table");
  if (!table) return;

  const rows = table.querySelectorAll("tr");
  let csv = [];

  // Add headers
  csv.push(
    "Request ID,Name,ID Number,Locker Number,Semester,Status,Date Created"
  );

  // Add data rows
  const tbody = table.querySelector("tbody");
  if (tbody) {
    const dataRows = tbody.querySelectorAll("tr");
    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];
      if (row.style.display !== "none") {
        const cells = row.querySelectorAll("td");
        const rowData = [
          cells[0].textContent.replace("#", "").trim(),
          cells[1].textContent.trim(),
          cells[2].textContent.trim(),
          cells[3].textContent.trim(),
          cells[4].textContent.trim(),
          cells[5].textContent.trim(),
          cells[6].textContent.trim(),
        ];
        csv.push(rowData.join(","));
      }
    }
  }

  // Download CSV
  const csvContent = csv.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download =
    "locker_requests_" + new Date().toISOString().split("T")[0] + ".csv";
  a.click();
  window.URL.revokeObjectURL(url);
}
