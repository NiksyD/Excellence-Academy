using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyWebApplication.Data;
using MyWebApplication.Models;
using MyWebApplication.Services;

namespace MyWebApplication.Controllers
{
    public class ActivityReservationController : Controller
    {
        private readonly ApplicationDbContext _db;
        private readonly IFileUploadService _fileUploadService;

        public ActivityReservationController(ApplicationDbContext db, IFileUploadService fileUploadService)
        {
            _db = db;
            _fileUploadService = fileUploadService;
        }

        public IActionResult Index()
        {
            IEnumerable<ActivityReservation> objActivityReservationList = _db.ActivityReservations;
            return View(objActivityReservationList);
        }

        //GET
        public IActionResult Create()
        {
            return View();
        }

        //POST
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(ActivityReservation obj, IFormFileCollection files)
        {
            if (ModelState.IsValid)
            {
                _db.ActivityReservations.Add(obj);
                await _db.SaveChangesAsync();

                // Handle file uploads if any
                if (files != null && files.Count > 0)
                {
                    var documents = await _fileUploadService.SaveActivityReservationFilesAsync(files, obj.Id);
                    _db.ActivityReservationDocuments.AddRange(documents);
                    await _db.SaveChangesAsync();
                }

                TempData["success"] = "Activity reservation submitted successfully";
                return RedirectToAction("Index");
            }
            return View(obj);
        }

        //GET
        [HttpGet]
        public IActionResult Details(int? id)
        {
            if (id == null || id == 0)
            {
                return NotFound();
            }
            var activityReservation = _db.ActivityReservations
                .Include(ar => ar.Documents)
                .FirstOrDefault(ar => ar.Id == id);
            if (activityReservation == null)
            {
                return NotFound();
            }
            return View(activityReservation);
        }

        //GET
        public IActionResult Edit(int? id)
        {
            if (id == null || id == 0)
            {
                return NotFound();
            }
            var activityReservation = _db.ActivityReservations
                .Include(ar => ar.Documents)
                .FirstOrDefault(ar => ar.Id == id);
            if (activityReservation == null)
            {
                return NotFound();
            }
            
            // Only allow editing if status is Pending
            if (activityReservation.Status != "Pending")
            {
                TempData["error"] = "Activity reservation can only be edited when status is Pending";
                return RedirectToAction("Index");
            }
            
            return View(activityReservation);
        }

        //POST
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(ActivityReservation obj, IFormFileCollection files)
        {
            var existingReservation = _db.ActivityReservations.Find(obj.Id);
            if (existingReservation == null)
            {
                return NotFound();
            }
            
            // Only allow editing if status is Pending
            if (existingReservation.Status != "Pending")
            {
                TempData["error"] = "Activity reservation can only be edited when status is Pending";
                return RedirectToAction("Index");
            }

            if (ModelState.IsValid)
            {
                // Update all editable fields
                existingReservation.OrganizationName = obj.OrganizationName;
                existingReservation.FormDate = obj.FormDate;
                existingReservation.ActivityTitle = obj.ActivityTitle;
                existingReservation.Venue = obj.Venue;
                existingReservation.DateNeeded = obj.DateNeeded;
                existingReservation.TimeFrom = obj.TimeFrom;
                existingReservation.TimeTo = obj.TimeTo;
                existingReservation.Participants = obj.Participants;
                existingReservation.Speaker = obj.Speaker;
                existingReservation.PurposeObjective = obj.PurposeObjective;
                existingReservation.EquipmentFacilitiesNeeded = obj.EquipmentFacilitiesNeeded;
                existingReservation.NatureOfActivity = obj.NatureOfActivity;
                existingReservation.SourceOfFunds = obj.SourceOfFunds;
                
                await _db.SaveChangesAsync();

                // Handle file uploads if any
                if (files != null && files.Count > 0)
                {
                    var documents = await _fileUploadService.SaveActivityReservationFilesAsync(files, obj.Id);
                    _db.ActivityReservationDocuments.AddRange(documents);
                    await _db.SaveChangesAsync();
                }
                
                TempData["success"] = "Activity reservation updated successfully";
                return RedirectToAction("Index");
            }
            return View(obj);
        }

        //GET
        [HttpGet]
        public IActionResult Review(int? id)
        {
            if (id == null || id == 0)
            {
                return NotFound();
            }
            var activityReservation = _db.ActivityReservations
                .Include(ar => ar.Documents)
                .FirstOrDefault(ar => ar.Id == id);
            if (activityReservation == null)
            {
                return NotFound();
            }
            
            return View(activityReservation);
        }

        //POST
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Review(ActivityReservation activityReservation, string action)
        {
            var existingReservation = _db.ActivityReservations.Find(activityReservation.Id);
            if (existingReservation == null)
            {
                return NotFound();
            }

            // Only allow review if status is Pending
            if (existingReservation.Status != "Pending")
            {
                TempData["error"] = "Activity reservation can only be reviewed when status is Pending";
                return RedirectToAction("Index");
            }

            if (action == "approve")
            {
                // Confirm Approval
                existingReservation.Status = "Approved";
                existingReservation.ApprovalDate = DateTime.Now;
                existingReservation.ApprovedBy = "Admin"; // In real app, use current user
                existingReservation.Remarks = activityReservation.Remarks ?? "Approved without remarks";
                TempData["success"] = $"Activity Reservation #{existingReservation.Id} for {existingReservation.ActivityTitle} has been approved successfully";
            }
            else if (action == "reject")
            {
                // Confirm Rejection - require remarks for rejection
                if (string.IsNullOrWhiteSpace(activityReservation.Remarks))
                {
                    TempData["error"] = "Rejection reason is required. Please provide remarks explaining why the activity reservation is being rejected.";
                    return View(existingReservation);
                }

                existingReservation.Status = "Rejected";
                existingReservation.ApprovalDate = DateTime.Now;
                existingReservation.ApprovedBy = "Admin"; // In real app, use current user
                existingReservation.Remarks = activityReservation.Remarks;
                TempData["success"] = $"Activity Reservation #{existingReservation.Id} for {existingReservation.ActivityTitle} has been rejected";
            }
            else
            {
                TempData["error"] = "Invalid action specified";
                return View(existingReservation);
            }

            _db.SaveChanges();
            return RedirectToAction("Index");
        }

        //GET
        public IActionResult Delete(int? id)
        {
            if (id == null || id == 0)
            {
                return NotFound();
            }
            var activityReservation = _db.ActivityReservations
                .Include(ar => ar.Documents)
                .FirstOrDefault(ar => ar.Id == id);
            if (activityReservation == null)
            {
                return NotFound();
            }

            // Only allow deletion if status is Pending
            if (activityReservation.Status != "Pending")
            {
                TempData["error"] = "Activity reservation can only be deleted when status is Pending";
                return RedirectToAction("Index");
            }

            return View(activityReservation);
        }

        //POST
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var activityReservation = _db.ActivityReservations
                .Include(ar => ar.Documents)
                .FirstOrDefault(ar => ar.Id == id);
            if (activityReservation == null)
            {
                return NotFound();
            }

            // Only allow deletion if status is Pending
            if (activityReservation.Status != "Pending")
            {
                TempData["error"] = "Activity reservation can only be deleted when status is Pending";
                return RedirectToAction("Index");
            }

            // Delete associated documents first
            if (activityReservation.Documents != null && activityReservation.Documents.Any())
            {
                foreach (var doc in activityReservation.Documents)
                {
                    // Delete physical file
                    var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", doc.FilePath.TrimStart('/'));
                    if (System.IO.File.Exists(filePath))
                    {
                        System.IO.File.Delete(filePath);
                    }
                }
                _db.ActivityReservationDocuments.RemoveRange(activityReservation.Documents);
            }

            // Delete the reservation
            _db.ActivityReservations.Remove(activityReservation);
            await _db.SaveChangesAsync();

            TempData["success"] = $"Activity Reservation #{activityReservation.Id} for {activityReservation.ActivityTitle} has been deleted successfully";
            return RedirectToAction("Index");
        }
    }
}