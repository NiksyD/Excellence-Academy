// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

// Global smooth scrolling for navbar buttons
document.addEventListener("DOMContentLoaded", function () {
  // Handle Schedule Visit button
  const scheduleVisitBtn = document.querySelector(".schedule-visit-btn");
  if (scheduleVisitBtn) {
    scheduleVisitBtn.addEventListener("click", function (e) {
      const target = document.querySelector("#contact");
      if (target) {
        // If on home page and contact section exists, scroll to it
        e.preventDefault();
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
      // Otherwise, let it navigate to home page with #contact anchor
    });
  }
});
