// Activity Reservation Create JavaScript Functions

let selectedFiles = [];

// File Upload functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeFileUpload();
});

function initializeFileUpload() {
    const fileUploadArea = document.getElementById('fileUploadArea');
    const fileInput = document.getElementById('fileInput');
    const fileListContainer = document.getElementById('fileListContainer');
    const fileList = document.getElementById('fileList');
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
        clearFileErrors();
        
        Array.from(files).forEach(file => {
            if (validateFile(file)) {
                // Check if file already exists
                const existingFile = selectedFiles.find(f => f.name === file.name && f.size === file.size);
                if (!existingFile) {
                    selectedFiles.push(file);
                }
            }
        });
        
        updateFileList();
        updateFileInput();
    }

    function updateFileList() {
        if (selectedFiles.length === 0) {
            fileListContainer.style.display = 'none';
            return;
        }
        
        fileListContainer.style.display = 'block';
        fileCount.textContent = selectedFiles.length;
        
        fileList.innerHTML = '';
        
        selectedFiles.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'list-group-item d-flex justify-content-between align-items-center';
            
            const fileInfo = document.createElement('div');
            fileInfo.innerHTML = `
                <div class="d-flex align-items-center">
                    <i class="fas fa-file-${getFileIcon(file.type)} text-primary me-3"></i>
                    <div>
                        <div class="fw-medium">${file.name}</div>
                        <small class="text-muted">${formatFileSize(file.size)}</small>
                    </div>
                </div>
            `;
            
            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.className = 'btn btn-outline-danger btn-sm rounded-pill';
            removeBtn.innerHTML = '<i class="fas fa-times"></i>';
            removeBtn.onclick = () => removeFile(index);
            
            fileItem.appendChild(fileInfo);
            fileItem.appendChild(removeBtn);
            fileList.appendChild(fileItem);
        });
    }

    function updateFileInput() {
        const dt = new DataTransfer();
        selectedFiles.forEach(file => dt.items.add(file));
        fileInput.files = dt.files;
    }

    function removeFile(index) {
        selectedFiles.splice(index, 1);
        updateFileList();
        updateFileInput();
    }

    function getFileIcon(mimeType) {
        if (mimeType.includes('pdf')) return 'pdf';
        if (mimeType.includes('word') || mimeType.includes('document')) return 'word';
        if (mimeType.includes('image')) return 'image';
        return 'alt';
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function showFileError(message) {
        const errorDiv = document.getElementById('fileErrors');
        const alert = document.createElement('div');
        alert.className = 'alert alert-danger alert-dismissible fade show';
        alert.innerHTML = `
            <i class="fas fa-exclamation-triangle me-2"></i>${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        errorDiv.appendChild(alert);
    }

    function clearFileErrors() {
        document.getElementById('fileErrors').innerHTML = '';
    }
}

// Add CSS for drag and drop styling
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
