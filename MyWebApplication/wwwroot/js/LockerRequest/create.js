// LockerRequest Create Form File Upload Functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeFileUpload();
    initializeFormValidation();
});

// Add CSS for enhanced drag and drop styling and badge colors
const style = document.createElement('style');
style.textContent = `
    .file-upload-zone {
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .file-upload-zone:hover {
        background: linear-gradient(135deg, #e7f3ff 0%, #f0f8ff 100%) !important;
        border-color: #0d6efd !important;
        transform: scale(1.01);
    }
    
    .file-upload-zone.drag-over {
        background: linear-gradient(135deg, #e7f3ff 0%, #cce7ff 100%) !important;
        border-color: #0d6efd !important;
        transform: scale(1.02);
    }
    
    /* Custom badge styling for file types */
    .bg-danger-subtle {
        background-color: #f8d7da !important;
    }
    
    .bg-primary-subtle {
        background-color: #cff4fc !important;
    }
    
    .bg-success-subtle {
        background-color: #d1e7dd !important;
    }
    
    .text-danger {
        color: #dc3545 !important;
    }
    
    .text-primary {
        color: #0d6efd !important;
    }
    
    .text-success {
        color: #198754 !important;
    }
`;
document.head.appendChild(style);

function initializeFileUpload() {
    const fileUploadArea = document.getElementById('fileUploadArea');
    const fileInput = document.getElementById('fileInput');
    const fileListContainer = document.getElementById('fileListContainer');
    const fileList = document.getElementById('fileList');
    const fileCount = document.getElementById('fileCount');
    
    let selectedFiles = [];

    // Drag and drop functionality
    fileUploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        fileUploadArea.classList.add('drag-over');
    });

    fileUploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        fileUploadArea.classList.remove('drag-over');
    });

    fileUploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        fileUploadArea.classList.remove('drag-over');
        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    });

    // Click to upload
    fileUploadArea.addEventListener('click', function() {
        fileInput.click();
    });

    fileInput.addEventListener('change', function(e) {
        const files = Array.from(e.target.files);
        handleFiles(files);
    });

    function validateFile(file) {
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/jpg', 'image/png'];
        
        if (file.size > maxSize) {
            showFileError(`File "${file.name}" is too large. Maximum size is 5MB.`);
            return false;
        }
        
        if (!allowedTypes.includes(file.type)) {
            showFileError(`File "${file.name}" is not a supported format. Please upload PDF, DOC, DOCX, JPG, or PNG files.`);
            return false;
        }
        
        return true;
    }

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
        fileList.innerHTML = '';
        fileCount.textContent = selectedFiles.length;

        if (selectedFiles.length > 0) {
            fileListContainer.classList.remove('d-none');
            
            selectedFiles.forEach((file, index) => {
                const listItem = document.createElement('li');
                listItem.className = 'list-group-item file-item d-flex align-items-center justify-content-between p-3';
                
                const fileInfo = document.createElement('div');
                fileInfo.className = 'd-flex align-items-center';
                
                const fileIcon = getFileIcon(file.type);
                const fileName = document.createElement('div');
                fileName.innerHTML = `
                    <div class="fw-medium">${file.name}</div>
                    <small class="text-muted file-size">${formatFileSize(file.size)}</small>
                `;
                
                fileInfo.appendChild(fileIcon);
                fileInfo.appendChild(fileName);
                
                const removeButton = document.createElement('button');
                removeButton.type = 'button';
                removeButton.className = 'btn btn-outline-danger btn-sm remove-file-btn';
                removeButton.innerHTML = '<i class="fas fa-times"></i>';
                removeButton.onclick = () => removeFile(index);
                
                listItem.appendChild(fileInfo);
                listItem.appendChild(removeButton);
                fileList.appendChild(listItem);
            });
        } else {
            fileListContainer.classList.add('d-none');
        }
        
        // Update the file input
        updateFileInput();
    }

    function removeFile(index) {
        selectedFiles.splice(index, 1);
        updateFileList();
        showSuccessMessage('File removed successfully.');
    }

    function updateFileInput() {
        const dt = new DataTransfer();
        selectedFiles.forEach(file => dt.items.add(file));
        fileInput.files = dt.files;
    }

    function getFileIcon(fileType) {
        const iconElement = document.createElement('div');
        iconElement.className = 'file-icon me-3';
        
        if (fileType.includes('pdf')) {
            iconElement.innerHTML = '<i class="fas fa-file-pdf fa-2x text-danger"></i>';
        } else if (fileType.includes('word') || fileType.includes('document')) {
            iconElement.innerHTML = '<i class="fas fa-file-word fa-2x text-primary"></i>';
        } else if (fileType.includes('image')) {
            iconElement.innerHTML = '<i class="fas fa-file-image fa-2x text-success"></i>';
        } else {
            iconElement.innerHTML = '<i class="fas fa-file fa-2x text-muted"></i>';
        }
        
        return iconElement;
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function showFileError(message) {
        showAlert(message, 'danger');
    }

    function showSuccessMessage(message) {
        showAlert(message, 'success');
    }

    function showAlert(message, type) {
        // Remove existing alerts
        const existingAlerts = document.querySelectorAll('.file-upload-alert');
        existingAlerts.forEach(alert => alert.remove());

        // Create new alert
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show file-upload-alert mt-3`;
        alertDiv.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        // Insert after file upload area
        fileUploadArea.parentNode.insertBefore(alertDiv, fileUploadArea.nextSibling);

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            if (alertDiv && alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }
}

function initializeFormValidation() {
    const form = document.getElementById('createLockerRequestForm');
    const termsCheckbox = document.querySelector('input[name="TermsAccepted"]');
    const submitButton = form.querySelector('button[type="submit"]');

    if (!form || !termsCheckbox || !submitButton) {
        console.error('Form validation elements not found');
        return;
    }

    // Add form submit event listener
    form.addEventListener('submit', function(e) {
        console.log('Form submit triggered, terms checked:', termsCheckbox.checked);
        if (!termsCheckbox.checked) {
            e.preventDefault();
            e.stopPropagation();
            
            // Show error alert
            showTermsError();
            
            // Scroll to terms checkbox and highlight it
            termsCheckbox.focus();
            termsCheckbox.parentElement.classList.add('border', 'border-danger', 'rounded', 'p-2');
            
            // Remove highlight after 3 seconds
            setTimeout(() => {
                termsCheckbox.parentElement.classList.remove('border', 'border-danger', 'rounded', 'p-2');
            }, 3000);
            
            return false;
        }
    });

    // Add change event listener to terms checkbox
    termsCheckbox.addEventListener('change', function() {
        if (this.checked) {
            submitButton.disabled = false;
            submitButton.classList.remove('btn-secondary');
            submitButton.classList.add('btn-primary');
        } else {
            submitButton.disabled = true;
            submitButton.classList.remove('btn-primary');
            submitButton.classList.add('btn-secondary');
        }
    });

    // Initialize button state
    if (!termsCheckbox.checked) {
        submitButton.disabled = true;
        submitButton.classList.remove('btn-primary');
        submitButton.classList.add('btn-secondary');
    }
}

function showTermsError() {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.terms-validation-alert');
    existingAlerts.forEach(alert => alert.remove());

    // Create new alert
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-danger alert-dismissible fade show terms-validation-alert mt-3';
    alertDiv.innerHTML = `
        <i class="fas fa-exclamation-triangle me-2"></i>
        You must accept the Terms of Service to proceed with your locker request.
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    // Insert before the form
    const form = document.getElementById('createLockerRequestForm');
    form.parentNode.insertBefore(alertDiv, form);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        if (alertDiv && alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}
