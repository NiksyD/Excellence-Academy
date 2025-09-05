// Search functionality
document.getElementById('searchInput').addEventListener('keyup', function() {
    const searchTerm = this.value.toLowerCase();
    const table = document.getElementById('studentsTable');
    const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    }
});

// Course filter functionality
document.getElementById('courseFilter').addEventListener('change', function() {
    const selectedCourse = this.value.toLowerCase();
    const table = document.getElementById('studentsTable');
    const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const courseCell = row.cells[2].textContent.toLowerCase();
        
        if (selectedCourse === '' || courseCell.includes(selectedCourse)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    }
});

// Export to CSV functionality
function exportToCSV() {
    const table = document.getElementById('studentsTable');
    const rows = table.querySelectorAll('tr');
    let csv = [];
    
    // Add headers
    csv.push('ID,Full Name,Program,Email,Date Enrolled');
    
    // Add data rows
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (row.style.display !== 'none') {
            const cells = row.querySelectorAll('td');
            const rowData = [
                cells[0].textContent.replace('#', '').trim(),
                cells[1].textContent.trim().replace(/\s+/g, ' '),
                cells[2].textContent.trim(),
                cells[3].textContent.replace(/✉\s*/, '').trim(),
                cells[4].textContent.trim()
            ];
            csv.push(rowData.map(field => `"${field}"`).join(','));
        }
    }
    
    // Download CSV
    const csvContent = csv.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students_' + new Date().toISOString().split('T')[0] + '.csv';
    a.click();
    window.URL.revokeObjectURL(url);
}
