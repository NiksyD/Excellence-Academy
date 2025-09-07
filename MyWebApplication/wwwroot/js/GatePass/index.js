// Gate Pass Management JavaScript Functions

// Search functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const departmentFilter = document.getElementById('departmentFilter');

    if (searchInput) {
        searchInput.addEventListener('keyup', function() {
            const searchTerm = this.value.toLowerCase();
            const table = document.getElementById('gatePassTable');
            if (table) {
                const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
                
                for (let i = 0; i < rows.length; i++) {
                    const row = rows[i];
                    const text = row.textContent.toLowerCase();
                    row.style.display = text.includes(searchTerm) ? '' : 'none';
                }
            }
        });
    }

    // Status filter functionality
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            const selectedStatus = this.value.toLowerCase();
            const table = document.getElementById('gatePassTable');
            if (table) {
                const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
                
                for (let i = 0; i < rows.length; i++) {
                    const row = rows[i];
                    const statusCell = row.cells[5].textContent.toLowerCase();
                    
                    if (selectedStatus === '' || statusCell.includes(selectedStatus)) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                }
            }
        });
    }

    // Department filter functionality
    if (departmentFilter) {
        departmentFilter.addEventListener('change', function() {
            const selectedDept = this.value.toLowerCase();
            const table = document.getElementById('gatePassTable');
            if (table) {
                const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
                
                for (let i = 0; i < rows.length; i++) {
                    const row = rows[i];
                    const deptCell = row.cells[2].textContent.toLowerCase();
                    
                    if (selectedDept === '' || deptCell.includes(selectedDept)) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                }
            }
        });
    }
});

// Export to CSV functionality
function exportToCSV() {
    const table = document.getElementById('gatePassTable');
    if (!table) return;
    
    const rows = table.querySelectorAll('tr');
    let csv = [];
    
    // Add headers
    csv.push('ID,Name,Department,Vehicle,Date,Status');
    
    // Add data rows
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (row.style.display !== 'none') {
            const cells = row.querySelectorAll('td');
            const rowData = [
                cells[0].textContent.replace('#', '').trim(),
                cells[1].textContent.trim().split('\n')[0],
                cells[2].textContent.trim().split('\n')[0],
                cells[3].textContent.trim().split('\n')[0],
                cells[4].textContent.trim(),
                cells[5].textContent.trim()
            ];
            csv.push(rowData.join(','));
        }
    }
    
    // Download CSV
    const csvContent = csv.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gate_passes_' + new Date().toISOString().split('T')[0] + '.csv';
    a.click();
    window.URL.revokeObjectURL(url);
}