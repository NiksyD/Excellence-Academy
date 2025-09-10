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

        public GatePassController(ApplicationDbContext db, IFileUploadService fileUploadService)
        {
            _db = db;
            _fileUploadService = fileUploadService;
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
            var gatePass = _db.GatePasses.Find(id);
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
        public async Task<IActionResult> Edit(GatePass obj, List<IFormFile> files)
        {
            var existingGatePass = _db.GatePasses
                .Include(g => g.Documents)
                .FirstOrDefault(g => g.Id == obj.Id);
                
            if (existingGatePass == null)
            {
                return NotFound();
            }

            // Check if the gate pass can be edited
            if (existingGatePass.Status != "Pending")
            {
                TempData["error"] = "Gate Pass can only be edited when status is Pending";
                return RedirectToAction("Index");
            }

            if (ModelState.IsValid)
            {
                // Update all editable fields
                existingGatePass.Name = obj.Name;
                existingGatePass.Address = obj.Address;
                existingGatePass.RegistrationExpiryDate = obj.RegistrationExpiryDate;
                existingGatePass.Department = obj.Department;
                existingGatePass.Faculty = obj.Faculty;
                existingGatePass.CourseYear = obj.CourseYear;
                existingGatePass.VehicleType = obj.VehicleType;
                existingGatePass.Maker = obj.Maker;
                existingGatePass.Color = obj.Color;
                existingGatePass.VehiclePlateNo = obj.VehiclePlateNo;
                existingGatePass.Date = obj.Date;
                existingGatePass.Remarks = obj.Remarks;

                // Handle file uploads if any new files are provided
                if (files != null && files.Count > 0 && files.Any(f => f.Length > 0))
                {
                    try
                    {
                        var validFiles = files.Where(f => f.Length > 0).ToList();
                        var formFileCollection = new FormFileCollection();
                        foreach (var file in validFiles)
                        {
                            formFileCollection.Add(file);
                        }
                        
                        var documents = await _fileUploadService.SaveFilesAsync(formFileCollection, existingGatePass.Id);
                        
                        foreach (var document in documents)
                        {
                            _db.GatePassDocuments.Add(document);
                        }
                    }
                    catch (Exception ex)
                    {
                        TempData["error"] = $"Error uploading files: {ex.Message}";
                        return View(existingGatePass);
                    }
                }
                
                _db.SaveChanges();
                TempData["success"] = "Gate Pass updated successfully" + 
                    (files?.Any(f => f.Length > 0) == true ? $" with {files.Count(f => f.Length > 0)} new file(s)" : "");
                return RedirectToAction("Index");
            }
            return View(existingGatePass);
        }


        //GET
        [HttpGet]
        public IActionResult Review(int? id)
        {
            if (id == null || id == 0)
            {
                return NotFound();
            }
            var gatePass = _db.GatePasses.Find(id);
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
    }
}
