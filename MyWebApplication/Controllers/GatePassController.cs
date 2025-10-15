using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyWebApplication.Data;
using MyWebApplication.Models;
using MyWebApplication.Services;

namespace MyWebApplication.Controllers
{
    public class GatePassController : Controller
    {
        private readonly ApplicationDbContext _db;
        private readonly IFileUploadService _fileUploadService;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public GatePassController(ApplicationDbContext db, IFileUploadService fileUploadService, IWebHostEnvironment webHostEnvironment)
        {
            _db = db;
            _fileUploadService = fileUploadService;
            _webHostEnvironment = webHostEnvironment;
        }

        public IActionResult Index()
        {
            IEnumerable<GatePass> objGatePassList = _db.GatePasses;
            return View(objGatePassList);
        }

        //GET
        public IActionResult Create()
        {
            return View();
        }

        //POST
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(GatePass obj, IFormFileCollection files)
        {
            // Debug: Check if files are received
            System.Diagnostics.Debug.WriteLine($"Files received: {files?.Count ?? 0}");
            
            if (ModelState.IsValid)
            {
                // Save the GatePass first to get the ID
                _db.GatePasses.Add(obj);
                _db.SaveChanges();

                // Handle file uploads using the service
                if (files != null && files.Count > 0)
                {
                    System.Diagnostics.Debug.WriteLine($"Processing {files.Count} files");
                    var documents = await _fileUploadService.SaveFilesAsync(files, obj.Id);
                    _db.GatePassDocuments.AddRange(documents);
                    _db.SaveChanges();
                    System.Diagnostics.Debug.WriteLine($"Saved {documents.Count} documents to database");
                }
                else
                {
                    System.Diagnostics.Debug.WriteLine("No files to process");
                }

                TempData["success"] = "Gate Pass application submitted successfully";
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
            var gatePass = _db.GatePasses
                .Include(g => g.Documents)
                .FirstOrDefault(g => g.Id == id);
            if (gatePass == null)
            {
                return NotFound();
            }
            return View(gatePass);
        }

        //GET
        public IActionResult Edit(int? id)
        {
            if (id == null || id == 0)
            {
                return NotFound();
            }
            var gatePass = _db.GatePasses.Include(g => g.Documents).FirstOrDefault(g => g.Id == id);
            if (gatePass == null)
            {
                return NotFound();
            }
            
            // Only allow editing if status is Pending
            if (gatePass.Status != "Pending")
            {
                TempData["error"] = "Gate Pass can only be edited when status is Pending";
                return RedirectToAction("Index");
            }
            
            return View(gatePass);
        }

        //POST
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(GatePass obj, IFormFileCollection files)
        {
            var existingGatePass = _db.GatePasses.Find(obj.Id);
            if (existingGatePass == null)
            {
                return NotFound();
            }
            
            // Only allow editing if status is Pending
            if (existingGatePass.Status != "Pending")
            {
                TempData["error"] = "Gate Pass can only be edited when status is Pending";
                return RedirectToAction("Index");
            }

            if (ModelState.IsValid)
            {
                // Update all editable fields
                existingGatePass.Name = obj.Name;
                existingGatePass.RegistrationExpiryDate = obj.RegistrationExpiryDate;
                existingGatePass.Department = obj.Department;
                existingGatePass.Faculty = obj.Faculty;
                existingGatePass.CourseYear = obj.CourseYear;
                existingGatePass.VehicleType = obj.VehicleType;
                existingGatePass.Maker = obj.Maker;
                existingGatePass.Color = obj.Color;
                existingGatePass.VehiclePlateNo = obj.VehiclePlateNo;
                existingGatePass.Date = obj.Date;
                
                _db.SaveChanges();

                // Handle file uploads using the service
                if (files != null && files.Count > 0)
                {
                    System.Diagnostics.Debug.WriteLine($"Processing {files.Count} files for edit");
                    var documents = await _fileUploadService.SaveFilesAsync(files, obj.Id);
                    _db.GatePassDocuments.AddRange(documents);
                    _db.SaveChanges();
                    System.Diagnostics.Debug.WriteLine($"Saved {documents.Count} new documents to database");
                }
                
                TempData["success"] = "Gate Pass updated successfully";
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
            var gatePass = _db.GatePasses
                .Include(g => g.Documents)
                .FirstOrDefault(g => g.Id == id);
            if (gatePass == null)
            {
                return NotFound();
            }
            
            // Only allow review if status is Pending
            if (gatePass.Status != "Pending")
            {
                TempData["error"] = "Gate Pass can only be reviewed when status is Pending";
                return RedirectToAction("Index");
            }
            
            return View(gatePass);
        }

        //POST
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Review(GatePass gatePass, string action)
        {
            var existingGatePass = _db.GatePasses.Find(gatePass.Id);
            if (existingGatePass == null)
            {
                return NotFound();
            }

            // Only allow review if status is Pending
            if (existingGatePass.Status != "Pending")
            {
                TempData["error"] = "Gate Pass can only be reviewed when status is Pending";
                return RedirectToAction("Index");
            }

            if (action == "approve")
            {
                // Confirm Approval
                existingGatePass.Status = "Approved";
                existingGatePass.ApprovalDate = DateTime.Now;
                existingGatePass.ApprovedBy = "Admin"; // In real app, use current user
                existingGatePass.Remarks = gatePass.Remarks ?? "Approved without remarks";
                TempData["success"] = $"Gate Pass #{existingGatePass.Id} for {existingGatePass.Name} has been approved successfully";
            }
            else if (action == "reject")
            {
                // Confirm Rejection - require remarks for rejection
                if (string.IsNullOrWhiteSpace(gatePass.Remarks))
                {
                    TempData["error"] = "Rejection reason is required. Please provide remarks explaining why the gate pass is being rejected.";
                    return View(existingGatePass);
                }

                existingGatePass.Status = "Rejected";
                existingGatePass.ApprovalDate = DateTime.Now;
                existingGatePass.ApprovedBy = "Admin"; // In real app, use current user
                existingGatePass.Remarks = gatePass.Remarks;
                TempData["success"] = $"Gate Pass #{existingGatePass.Id} for {existingGatePass.Name} has been rejected";
            }
            else
            {
                TempData["error"] = "Invalid action specified";
                return View(existingGatePass);
            }

            _db.SaveChanges();
            return RedirectToAction("Index");
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteDocument(int id)
        {
            var document = await _db.GatePassDocuments.FindAsync(id);
            if (document == null)
            {
                return NotFound();
            }

            // Check if the associated GatePass is still editable (Pending status)
            var gatePass = await _db.GatePasses.FindAsync(document.GatePassId);
            if (gatePass == null || gatePass.Status != "Pending")
            {
                return BadRequest("Documents can only be deleted when the Gate Pass status is Pending");
            }

            try
            {
                // Delete the physical file
                var filePath = Path.Combine(_webHostEnvironment.WebRootPath, "uploads", "gatepasses", document.StoredFileName);
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }

                // Remove from database
                _db.GatePassDocuments.Remove(document);
                await _db.SaveChangesAsync();

                return Ok();
            }
            catch (Exception)
            {
                // Log the error (you might want to use a proper logging framework)
                return StatusCode(500, "An error occurred while deleting the document");
            }
        }

        //GET
        public IActionResult Delete(int? id)
        {
            if (id == null || id == 0)
            {
                return NotFound();
            }
            var gatePass = _db.GatePasses
                .Include(g => g.Documents)
                .FirstOrDefault(g => g.Id == id);
            if (gatePass == null)
            {
                return NotFound();
            }

            // Only allow deletion if status is Pending
            if (gatePass.Status != "Pending")
            {
                TempData["error"] = "Gate Pass can only be deleted when status is Pending";
                return RedirectToAction("Index");
            }

            return View(gatePass);
        }

        //POST
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var gatePass = _db.GatePasses
                .Include(g => g.Documents)
                .FirstOrDefault(g => g.Id == id);
            if (gatePass == null)
            {
                return NotFound();
            }

            // Only allow deletion if status is Pending
            if (gatePass.Status != "Pending")
            {
                TempData["error"] = "Gate Pass can only be deleted when status is Pending";
                return RedirectToAction("Index");
            }

            // Delete associated documents first
            if (gatePass.Documents != null && gatePass.Documents.Any())
            {
                foreach (var doc in gatePass.Documents)
                {
                    // Delete physical file
                    var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", doc.FilePath.TrimStart('/'));
                    if (System.IO.File.Exists(filePath))
                    {
                        System.IO.File.Delete(filePath);
                    }
                }
                _db.GatePassDocuments.RemoveRange(gatePass.Documents);
            }

            // Delete the gate pass
            _db.GatePasses.Remove(gatePass);
            await _db.SaveChangesAsync();

            TempData["success"] = $"Gate Pass #{gatePass.Id} for {gatePass.Name} has been deleted successfully";
            return RedirectToAction("Index");
        }
    }
}
