// ActivityReservation Review JavaScript Functions

function submitApproval(action) {
  // Find the form by method and action
  const form = document.querySelector('form[method="post"]');
  if (!form) {
    console.error("Form not found");
    return;
  }

  // Validate remarks for rejection
  if (action === "reject") {
    const remarksField = form.querySelector('textarea[name="Remarks"]');
    if (!remarksField || !remarksField.value.trim()) {
      showCustomAlert();
      // Close modal and focus on remarks field
      const modal = document.querySelector(".modal.show");
      if (modal) {
        const modalInstance = bootstrap.Modal.getInstance(modal);
        if (modalInstance) {
          modalInstance.hide();
        }
      }
      if (remarksField) {
        remarksField.focus();
        remarksField.style.borderColor = "#dc3545";
      }
      return;
    }
  }

  // Remove any existing action inputs to avoid duplicates
  const existingActionInput = form.querySelector('input[name="action"]');
  if (existingActionInput) {
    existingActionInput.remove();
  }

  // Create a hidden input for the action
  const actionInput = document.createElement("input");
  actionInput.type = "hidden";
  actionInput.name = "action";
  actionInput.value = action;
  form.appendChild(actionInput);

  // Close the modal
  const modal = document.querySelector(".modal.show");
  if (modal) {
    const modalInstance = bootstrap.Modal.getInstance(modal);
    if (modalInstance) {
      modalInstance.hide();
    }
  }

  // Submit the form
  form.submit();
}

// Custom alert function for rejection validation
function showCustomAlert() {
  // Remove existing custom alert if any
  const existingAlert = document.getElementById("customAlert");
  if (existingAlert) {
    existingAlert.remove();
  }

  // Create custom alert HTML
  const alertHTML = `
        <div id="customAlert" class="position-fixed top-0 start-50 translate-middle-x" style="z-index: 9999; margin-top: 20px;">
            <div class="alert alert-danger alert-dismissible fade show shadow-lg" role="alert" style="min-width: 400px;">
                <div class="d-flex align-items-center">
                    <i class="fas fa-exclamation-triangle me-3" style="font-size: 1.5rem;"></i>
                    <div>
                        <h6 class="alert-heading mb-1">Rejection Reason Required</h6>
                        <p class="mb-0">Please provide remarks explaining why the activity reservation is being rejected.</p>
                    </div>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        </div>
    `;

  // Insert alert into page
  document.body.insertAdjacentHTML("afterbegin", alertHTML);

  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    const alert = document.getElementById("customAlert");
    if (alert) {
      const bsAlert = new bootstrap.Alert(alert.querySelector(".alert"));
      bsAlert.close();
    }
  }, 5000);
}

// Clear validation styling when user starts typing in remarks
document.addEventListener("DOMContentLoaded", function () {
  const remarksField = document.querySelector('textarea[name="Remarks"]');
  if (remarksField) {
    remarksField.addEventListener("input", function () {
      if (this.style.borderColor === "rgb(220, 53, 69)") {
        this.style.borderColor = "";
      }
    });
  }
});
