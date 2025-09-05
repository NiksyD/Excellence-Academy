using Microsoft.AspNetCore.Mvc;
using MyWebApplication.Data;
using MyWebApplication.Models;

namespace MyWebApplication.Controllers
{
    public class GatePassController : Controller
    {
        private readonly ApplicationDbContext _db;

        public GatePassController(ApplicationDbContext db)
        {
            _db = db;
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
        public IActionResult Create(GatePass obj)
        {
            if (ModelState.IsValid)
            {
                _db.GatePasses.Add(obj);
                _db.SaveChanges();
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
            var gatePass = _db.GatePasses.Find(id);
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
        public IActionResult Edit(GatePass obj)
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
                existingGatePass.AttachedDocuments = obj.AttachedDocuments;
                existingGatePass.Date = obj.Date;
                
                _db.SaveChanges();
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
