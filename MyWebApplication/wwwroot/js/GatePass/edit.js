// Real-time preview functionality
function updatePreview() {
    const name = document.getElementById('Name').value || '';
    const department = document.getElementById('Department').value || '';
    const plateNo = document.getElementById('VehiclePlateNo').value || '';
    const vehicleType = document.getElementById('VehicleType').value || '';
    
    const previewName = document.getElementById('previewName');
    const previewDepartment = document.getElementById('previewDepartment');
    const previewVehicle = document.getElementById('previewVehicle');
    
    previewName.textContent = name || 'Applicant Name';
    previewDepartment.textContent = department || 'Department';
    previewVehicle.textContent = `${plateNo} - ${vehicleType}`.trim() || 'Vehicle Info';
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
document.getElementById('editGatePassForm').addEventListener('submit', function(e) {
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

// File Upload Functionality
document.addEventListener('DOMContentLoaded', function() {
    const fileUploadArea = document.getElementById('fileUploadArea');
    const fileInput = document.getElementById('fileInput');
    const fileListContainer = document.getElementById('fileListContainer');
    const fileList = document.getElementById('fileList');
    const fileCount = document.getElementById('fileCount');
    let selectedFiles = [];

    // Drag and drop functionality
    fileUploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();
        fileUploadArea.classList.add('drag-over');
    });

    fileUploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (!fileUploadArea.contains(e.relatedTarget)) {
            fileUploadArea.classList.remove('drag-over');
        }
    });

    fileUploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        fileUploadArea.classList.remove('drag-over');
        
        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    });

    // Click to upload
    fileUploadArea.addEventListener('click', function(e) {
        if (e.target.closest('button')) return;
        fileInput.click();
    });

    fileInput.addEventListener('change', function(e) {
        const files = Array.from(e.target.files);
        handleFiles(files);
    });

    function handleFiles(files) {
        const validFiles = files.filter(file => {
            const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/jpg', 'image/png'];
            const maxSize = 5 * 1024 * 1024; // 5MB

            if (!validTypes.includes(file.type)) {
                showFileError(`File "${file.name}" is not a supported format. Please upload PDF, DOC, DOCX, JPG, or PNG files.`);
                return false;
            }

            if (file.size > maxSize) {
                showFileError(`File "${file.name}" is too large. Maximum file size is 5MB.`);
                return false;
            }

            return true;
        });

        if (validFiles.length > 0) {
            selectedFiles = [...selectedFiles, ...validFiles];
            updateFileList();
            showSuccessMessage(`${validFiles.length} file(s) selected successfully.`);
        }
    }

    function updateFileList() {
        if (selectedFiles.length === 0) {
            fileListContainer.classList.add('d-none');
            return;
        }

        fileListContainer.classList.remove('d-none');
        fileCount.textContent = selectedFiles.length;
        
        fileList.innerHTML = '';
        selectedFiles.forEach((file, index) => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item d-flex justify-content-between align-items-center py-3';
            
            listItem.innerHTML = `
                <div class="d-flex align-items-center">
                    <div class="file-icon me-3">
                        <i class="fas ${getFileIcon(file.type)} fa-2x ${getFileIconColor(file.type)}"></i>
                    </div>
                    <div>
                        <h6 class="mb-1 fw-medium">${file.name}</h6>
                        <small class="text-muted">
                            <span class="badge bg-secondary me-2">${getFileTypeLabel(file.type)}</span>
                            ${formatFileSize(file.size)}
                        </small>
                    </div>
                </div>
                <div class="file-actions">
                    <button type="button" class="btn btn-outline-danger btn-sm" onclick="removeFile(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            fileList.appendChild(listItem);
        });
    }

    window.removeFile = function(index) {
        selectedFiles.splice(index, 1);
        updateFileList();
        
        // Update file input
        const dt = new DataTransfer();
        selectedFiles.forEach(file => dt.items.add(file));
        fileInput.files = dt.files;
        
        if (selectedFiles.length === 0) {
            showSuccessMessage('All files removed.', 'info');
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
});

// Delete document functionality
function deleteDocument(documentId, fileName) {
    if (confirm(`Are you sure you want to delete "${fileName}"? This action cannot be undone.`)) {
        fetch(`/GatePass/DeleteDocument/${documentId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'RequestVerificationToken': document.querySelector('input[name="__RequestVerificationToken"]').value
            }
        })
        .then(response => {
            if (response.ok) {
                // Remove the document element from the DOM
                const documentElement = document.querySelector(`button[onclick*="${documentId}"]`).closest('.col-md-6');
                documentElement.remove();
                
                // Check if there are any documents left
                const remainingDocs = document.querySelectorAll('.existing-files-container .col-md-6');
                if (remainingDocs.length === 0) {
                    document.querySelector('.existing-files-container').remove();
                }
                
                showSuccessMessage(`"${fileName}" has been deleted successfully.`);
            } else {
                showFileError(`Failed to delete "${fileName}". Please try again.`);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showFileError(`An error occurred while deleting "${fileName}".`);
        });
    }
}