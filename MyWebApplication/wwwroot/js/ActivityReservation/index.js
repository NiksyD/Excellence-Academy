// Activity Reservation Management JavaScript Functions

// Search functionality
document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchInput");
  const statusFilter = document.getElementById("statusFilter");

  function filterTable() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : "";
    const selectedStatus = statusFilter ? statusFilter.value.toLowerCase() : "";
    const table = document.querySelector("table");

    if (table) {
      const rows = table
        .getElementsByTagName("tbody")[0]
        .getElementsByTagName("tr");

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const text = row.textContent.toLowerCase();
        const statusCell = row.cells[5].textContent.toLowerCase();

        const matchesSearch = searchTerm === "" || text.includes(searchTerm);
        const matchesStatus =
          selectedStatus === "" || statusCell.includes(selectedStatus);

        row.style.display = matchesSearch && matchesStatus ? "" : "none";
      }
    }
  }

  if (searchInput) {
    searchInput.addEventListener("keyup", filterTable);
  }

  if (statusFilter) {
    statusFilter.addEventListener("change", filterTable);
  }
});

// Export to CSV functionality
function exportToCSV() {
  const table = document.querySelector("table");
  if (!table) return;

  const rows = table.querySelectorAll("tr");
  let csv = [];

  // Add headers
  csv.push("ID,Organization,Activity Title,Venue,Date Needed,Status");

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
    "activity_reservations_" + new Date().toISOString().split("T")[0] + ".csv";
  a.click();
  window.URL.revokeObjectURL(url);
}
