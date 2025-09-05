// Real-time preview functionality
function updatePreview() {
    const firstName = document.getElementById('Firstname').value || '';
    const lastName = document.getElementById('Lastname').value || '';
    const email = document.getElementById('Email').value || '';
    const course = document.getElementById('Course').value || '';
    
    const initials = document.getElementById('previewInitials');
    const name = document.getElementById('previewName');
    const emailPreview = document.getElementById('previewEmail');
    const coursePreview = document.getElementById('previewCourse');
    
    initials.textContent = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || '--';
    name.textContent = `${firstName} ${lastName}`.trim() || 'Full Name';
    emailPreview.textContent = email || 'email@example.com';
    coursePreview.textContent = course || 'Program';
}

// Add event listeners for real-time preview
document.addEventListener('DOMContentLoaded', function() {
    const inputs = ['Firstname', 'Lastname', 'Email', 'Course'];
    inputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', updatePreview);
            element.addEventListener('change', updatePreview);
        }
    });
});

// Form validation enhancement
document.getElementById('editStudentForm').addEventListener('submit', function(e) {
    const requiredFields = ['Firstname', 'Lastname', 'Email', 'Course'];
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

// Email validation
document.getElementById('Email').addEventListener('blur', function() {
    const email = this.value;
    const atChar = String.fromCharCode(64);
    const dotChar = String.fromCharCode(46);
    const atPos = email.indexOf(atChar);
    const dotPos = email.indexOf(dotChar);
    const isValidEmail = atPos > 0 && dotPos > atPos && email.length > 5;
    
    if (email && !isValidEmail) {
        this.classList.add('is-invalid');
    } else {
        this.classList.remove('is-invalid');
    }
});
