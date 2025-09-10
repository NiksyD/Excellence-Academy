// Gate Pass Create JavaScript Functions

let selectedFiles = [];

// File Upload functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeFileUpload();
    initializePreview();
});

function initializeFileUpload() {
    const fileUploadArea = document.getElementById('fileUploadArea');
    const fileInput = document.getElementById('fileInput');
    const fileList = document.getElementById('fileList');
    const fileItems = document.getElementById('fileItems');
    const fileCount = document.getElementById('fileCount');

    if (!fileInput || !fileUploadArea) return;

    // Drag and drop events
    fileUploadArea.addEventListener('dragover', handleDragOver);
    fileUploadArea.addEventListener('dragleave', handleDragLeave);
    fileUploadArea.addEventListener('drop', handleDrop);
    fileUploadArea.addEventListener('click', () => fileInput.click());

    // File input change event
    fileInput.addEventListener('change', function(e) {
        handleFiles(e.target.files);
    });

    function handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        fileUploadArea.classList.add('drag-over');
        fileUploadArea.style.borderColor = '#0d6efd';
        fileUploadArea.style.backgroundColor = '#e7f3ff';
        fileUploadArea.style.transform = 'scale(1.02)';
    }

    function handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        fileUploadArea.classList.remove('drag-over');
        fileUploadArea.style.borderColor = '#dee2e6';
        fileUploadArea.style.backgroundColor = '';
        fileUploadArea.style.transform = 'scale(1)';
    }

    function handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        handleDragLeave(e);
        
        const files = e.dataTransfer.files;
        handleFiles(files);
    }

    function handleFiles(files) {
        selectedFiles = [];
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (validateFile(file)) {
                selectedFiles.push(file);
            }
        }
        
        updateFileInput();
        displaySelectedFiles();
    }

    function updateFileInput() {
        const dt = new DataTransfer();
        selectedFiles.forEach(file => {
            dt.items.add(file);
        });
        fileInput.files = dt.files;
    }

    function displaySelectedFiles() {
        fileItems.innerHTML = '';
        
        if (selectedFiles.length > 0) {
            selectedFiles.forEach((file, index) => {
                addFileToList(file, index);
            });
            fileList.style.display = 'block';
            fileCount.textContent = selectedFiles.length;
        } else {
            fileList.style.display = 'none';
            fileCount.textContent = '0';
        }
    }

    function validateFile(file) {
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/jpg', 'image/png'];
        
        if (file.size > maxSize) {
            showFileError(`File "${file.name}" is too large. Maximum size is 5MB.`);
            return false;
        }
        
        if (!allowedTypes.includes(file.type)) {
            showFileError(`File "${file.name}" has an unsupported format. Please use PDF, DOC, DOCX, JPG, or PNG.`);
            return false;
        }
        
        return true;
    }

    function addFileToList(file, index) {
        const fileItem = document.createElement('div');
        fileItem.className = 'list-group-item d-flex align-items-center justify-content-between p-3 border-0';
        fileItem.innerHTML = `
            <div class="d-flex align-items-center flex-grow-1">
                <div class="file-icon me-3">
                    <i class="fas ${getFileIcon(file.type)} fa-2x ${getFileIconColor(file.type)}"></i>
                </div>
                <div class="file-info flex-grow-1">
                    <div class="fw-semibold text-dark mb-1">${file.name}</div>
                    <div class="d-flex align-items-center gap-3">
                        <small class="text-muted">
                            <i class="fas fa-weight-hanging me-1"></i>${formatFileSize(file.size)}
                        </small>
                        <small class="text-muted">
                            <i class="fas fa-file-alt me-1"></i>${getFileTypeLabel(file.type)}
                        </small>
                    </div>
                </div>
            </div>
            <div class="file-actions">
                <button type="button" class="btn btn-outline-danger btn-sm rounded-pill" onclick="removeFile(${index})" title="Remove file">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        fileItems.appendChild(fileItem);
    }

    // Global function to remove files
    window.removeFile = function(index) {
        selectedFiles.splice(index, 1);
        updateFileInput();
        displaySelectedFiles();
        
        if (selectedFiles.length === 0) {
            showSuccessMessage('All files removed successfully', 'info');
        }
    };

    function getFileIcon(fileType) {
        if (fileType.includes('pdf')) return 'fa-file-pdf';
        if (fileType.includes('word') || fileType.includes('document')) return 'fa-file-word';
        if (fileType.includes('image')) return 'fa-file-image';
        return 'fa-file';
    }

    function getFileIconColor(fileType) {
        if (fileType.includes('pdf')) return 'text-danger';
        if (fileType.includes('word') || fileType.includes('document')) return 'text-primary';
        if (fileType.includes('image')) return 'text-success';
        return 'text-muted';
    }

    function getFileTypeLabel(fileType) {
        if (fileType.includes('pdf')) return 'PDF Document';
        if (fileType.includes('word')) return 'Word Document';
        if (fileType.includes('document')) return 'Word Document';
        if (fileType.includes('image')) return 'Image File';
        return 'Document';
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function showFileError(message) {
        showMessage(message, 'danger');
    }

    function showSuccessMessage(message, type = 'success') {
        showMessage(message, type);
    }

    function showMessage(message, type) {
        // Remove existing alerts
        const existingAlerts = document.querySelectorAll('.file-upload-alert');
        existingAlerts.forEach(alert => alert.remove());

        const alertClass = type === 'danger' ? 'alert-danger' : type === 'info' ? 'alert-info' : 'alert-success';
        const iconClass = type === 'danger' ? 'fa-exclamation-triangle' : type === 'info' ? 'fa-info-circle' : 'fa-check-circle';
        
        const alertHTML = `
            <div class="alert ${alertClass} alert-dismissible fade show mt-3 file-upload-alert" role="alert">
                <i class="fas ${iconClass} me-2"></i>
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        fileUploadArea.insertAdjacentHTML('afterend', alertHTML);

        // Auto-dismiss success messages after 3 seconds
        if (type === 'success' || type === 'info') {
            setTimeout(() => {
                const alert = document.querySelector('.file-upload-alert');
                if (alert) {
                    const bsAlert = new bootstrap.Alert(alert);
                    bsAlert.close();
                }
            }, 3000);
        }
    }
}

// Real-time preview functionality
function updatePreview() {
    const name = document.getElementById('Name')?.value || '';
    const department = document.getElementById('Department')?.value || '';
    const plateNo = document.getElementById('VehiclePlateNo')?.value || '';
    const vehicleType = document.getElementById('VehicleType')?.value || '';
    
    const preview = document.getElementById('gatePassPreview');
    const previewName = document.getElementById('previewName');
    const previewDepartment = document.getElementById('previewDepartment');
    const previewVehicle = document.getElementById('previewVehicle');
    
    if (name || department || plateNo || vehicleType) {
        if (preview) preview.style.display = 'block';
        if (previewName) previewName.textContent = name || 'Applicant Name';
        if (previewDepartment) previewDepartment.textContent = department || 'Department';
        if (previewVehicle) previewVehicle.textContent = `${plateNo} - ${vehicleType}`.trim() || 'Vehicle Info';
    } else {
        if (preview) preview.style.display = 'none';
    }
}

function initializePreview() {
    const inputs = ['Name', 'Department', 'VehiclePlateNo', 'VehicleType'];
    inputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', updatePreview);
            element.addEventListener('change', updatePreview);
        }
    });
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