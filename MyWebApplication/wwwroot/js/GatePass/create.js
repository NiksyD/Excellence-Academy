// Real-time preview functionality
function updatePreview() {
    const name = document.getElementById('Name').value || '';
    const department = document.getElementById('Department').value || '';
    const plateNo = document.getElementById('VehiclePlateNo').value || '';
    const vehicleType = document.getElementById('VehicleType').value || '';
    
    const preview = document.getElementById('gatePassPreview');
    const previewName = document.getElementById('previewName');
    const previewDepartment = document.getElementById('previewDepartment');
    const previewVehicle = document.getElementById('previewVehicle');
    
    if (name || department || plateNo || vehicleType) {
        preview.style.display = 'block';
        previewName.textContent = name || 'Applicant Name';
        previewDepartment.textContent = department || 'Department';
        previewVehicle.textContent = `${plateNo} - ${vehicleType}`.trim() || 'Vehicle Info';
    } else {
        preview.style.display = 'none';
    }
}

// Add event listeners for real-time preview
document.addEventListener('DOMContentLoaded', function() {
    const inputs = ['Name', 'Department', 'VehiclePlateNo', 'VehicleType'];
    inputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', updatePreview);
            element.addEventListener('change', updatePreview);
        }
    });
});

// Form validation enhancement
document.getElementById('gatePassForm').addEventListener('submit', function(e) {
    const requiredFields = ['Name', 'Department', 'Address', 'VehiclePlateNo', 'VehicleType'];
    let isValid = true;
    
    requiredFields.forEach(field => {
        const input = document.getElementById(field);
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('is-invalid');
        } else {
            input.classList.remove('is-invalid');
        }
    });
    
    if (!isValid) {
        e.preventDefault();
        alert('Please fill in all required fields.');
    }
});

// Auto-uppercase plate number
document.getElementById('VehiclePlateNo').addEventListener('input', function(e) {
    e.target.value = e.target.value.toUpperCase();
    updatePreview();
});
