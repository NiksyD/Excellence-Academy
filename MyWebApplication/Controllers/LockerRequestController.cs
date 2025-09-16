using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyWebApplication.Data;
using MyWebApplication.Models;
using MyWebApplication.Services;

namespace MyWebApplication.Controllers
{
    public class LockerRequestController : Controller
    {
        private readonly ApplicationDbContext _db;
        private readonly IFileUploadService _fileUploadService;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public LockerRequestController(ApplicationDbContext db, IFileUploadService fileUploadService, IWebHostEnvironment webHostEnvironment)
        {
            _db = db;
            _fileUploadService = fileUploadService;
            _webHostEnvironment = webHostEnvironment;
        }

        //GET
        public IActionResult Index()
        {
            var lockerRequests = _db.LockerRequests.OrderByDescending(l => l.DateCreated).ToList();
            return View(lockerRequests);
        }

        //GET
        public IActionResult Create()
        {
            return View();
        }

        //POST
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(LockerRequest obj, IFormFileCollection files)
        {
            if (ModelState.IsValid)
            {
                // Save the LockerRequest first to get the ID
                _db.LockerRequests.Add(obj);
                _db.SaveChanges();

                // Handle file uploads using the service
                if (files != null && files.Count > 0)
                {
                    var documents = await _fileUploadService.SaveLockerRequestFilesAsync(files, obj.Id);
                    foreach (var document in documents)
                    {
                        _db.LockerRequestDocuments.Add(document);
                    }
                    _db.SaveChanges();
                }

                TempData["success"] = "Locker request submitted successfully";
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
            var lockerRequest = _db.LockerRequests
                .Include(l => l.Documents)
                .FirstOrDefault(l => l.Id == id);
            if (lockerRequest == null)
            {
                return NotFound();
            }
            return View(lockerRequest);
        }

        //GET
        [HttpGet]
        public IActionResult Edit(int? id)
        {
            if (id == null || id == 0)
            {
                return NotFound();
            }
            var lockerRequest = _db.LockerRequests
                .Include(l => l.Documents)
                .FirstOrDefault(l => l.Id == id);
            if (lockerRequest == null)
            {
                return NotFound();
            }
            
            // Only allow editing if status is Pending
            if (lockerRequest.Status != "Pending")
            {
                TempData["error"] = "Locker request can only be edited when status is Pending";
                return RedirectToAction("Index");
            }
            
            return View(lockerRequest);
        }

        //POST
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(LockerRequest obj, IFormFileCollection files)
        {
            var existingLockerRequest = _db.LockerRequests.Find(obj.Id);
            if (existingLockerRequest == null)
            {
                return NotFound();
            }
            
            // Only allow editing if status is Pending
            if (existingLockerRequest.Status != "Pending")
            {
                TempData["error"] = "Locker request can only be edited when status is Pending";
                return RedirectToAction("Index");
            }

            if (ModelState.IsValid)
            {
                // Update all editable fields
                existingLockerRequest.Name = obj.Name;
                existingLockerRequest.IdNumber = obj.IdNumber;
                existingLockerRequest.LockerNumber = obj.LockerNumber;
                existingLockerRequest.Semester = obj.Semester;
                existingLockerRequest.ContactNumber = obj.ContactNumber;
                existingLockerRequest.TermsAccepted = obj.TermsAccepted;
                
                _db.SaveChanges();

                // Handle file uploads using the service
                if (files != null && files.Count > 0)
                {
                    var documents = await _fileUploadService.SaveLockerRequestFilesAsync(files, obj.Id);
                    foreach (var document in documents)
                    {
                        _db.LockerRequestDocuments.Add(document);
                    }
                    _db.SaveChanges();
                }
                
                TempData["success"] = "Locker request updated successfully";
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
            var lockerRequest = _db.LockerRequests
                .Include(l => l.Documents)
                .FirstOrDefault(l => l.Id == id);
            if (lockerRequest == null)
            {
                return NotFound();
            }
            
            // Only allow review if status is Pending
            if (lockerRequest.Status != "Pending")
            {
                TempData["error"] = "Locker request can only be reviewed when status is Pending";
                return RedirectToAction("Index");
            }
            
            return View(lockerRequest);
        }

        //POST
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Review(LockerRequest lockerRequest, string action)
        {
            var existingLockerRequest = _db.LockerRequests.Find(lockerRequest.Id);
            if (existingLockerRequest == null)
            {
                return NotFound();
            }

            if (action == "approve")
            {
                existingLockerRequest.Status = "Approved";
                existingLockerRequest.ApprovedBy = "Admin"; // You might want to get this from user context
                existingLockerRequest.ApprovalDate = DateTime.Now;
                existingLockerRequest.Remarks = lockerRequest.Remarks;
                TempData["success"] = "Locker request approved successfully";
            }
            else if (action == "reject")
            {
                existingLockerRequest.Status = "Rejected";
                existingLockerRequest.ApprovedBy = "Admin"; // You might want to get this from user context
                existingLockerRequest.ApprovalDate = DateTime.Now;
                existingLockerRequest.Remarks = lockerRequest.Remarks;
                TempData["success"] = "Locker request rejected";
            }

            _db.SaveChanges();
            return RedirectToAction("Index");
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteDocument(int id)
        {
            var document = await _db.LockerRequestDocuments.FindAsync(id);
            if (document == null)
            {
                return NotFound();
            }

            // Check if the associated LockerRequest is still editable (Pending status)
            var lockerRequest = await _db.LockerRequests.FindAsync(document.LockerRequestId);
            if (lockerRequest == null || lockerRequest.Status != "Pending")
            {
                return BadRequest("Documents can only be deleted when the Locker Request status is Pending");
            }

            try
            {
                // Delete the physical file
                var filePath = Path.Combine(_webHostEnvironment.WebRootPath, "uploads", "lockerrequests", document.StoredFileName);
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }

                // Remove from database
                _db.LockerRequestDocuments.Remove(document);
                await _db.SaveChangesAsync();

                return Ok();
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while deleting the document");
            }
        }

        //GET
        [HttpGet]
        public IActionResult Delete(int? id)
        {
            if (id == null || id == 0)
            {
                return NotFound();
            }

            var lockerRequest = _db.LockerRequests.Include(lr => lr.Documents).FirstOrDefault(u => u.Id == id);
            if (lockerRequest == null)
            {
                return NotFound();
            }

            // Only allow deletion if status is Pending
            if (lockerRequest.Status != "Pending")
            {
                TempData["error"] = "Only pending locker requests can be deleted";
                return RedirectToAction("Details", new { id = id });
            }

            return View(lockerRequest);
        }

        //POST
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeletePOST(int? id)
        {
            var lockerRequest = _db.LockerRequests.Include(lr => lr.Documents).FirstOrDefault(u => u.Id == id);
            if (lockerRequest == null)
            {
                return NotFound();
            }

            // Only allow deletion if status is Pending
            if (lockerRequest.Status != "Pending")
            {
                TempData["error"] = "Only pending locker requests can be deleted";
                return RedirectToAction("Details", new { id = id });
            }

            // Delete associated documents and files
            foreach (var document in lockerRequest.Documents)
            {
                // Delete physical file
                await _fileUploadService.DeleteFileAsync(document.FilePath);
                
                // Remove document from database
                _db.LockerRequestDocuments.Remove(document);
            }

            // Delete the locker request
            _db.LockerRequests.Remove(lockerRequest);
            _db.SaveChanges();

            TempData["success"] = "Locker request deleted successfully";
            return RedirectToAction("Index");
        }
    }
}
