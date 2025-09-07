using System.ComponentModel.DataAnnotations;

namespace MyWebApplication.Models
{
    public class GatePass
    {
        [Key]
        public int Id { get; set; }

        [Required, MaxLength(100)]
        [Display(Name = "Name")]
        public string Name { get; set; } = string.Empty;

        [Required, MaxLength(200)]
        [Display(Name = "Address")]
        public string Address { get; set; } = string.Empty;

        [Required]
        [Display(Name = "Date")]
        [DataType(DataType.Date)]
        public DateTime Date { get; set; } = DateTime.Now;

        [Required, MaxLength(100)]
        [Display(Name = "Department")]
        public string Department { get; set; } = string.Empty;

        [MaxLength(50)]
        [Display(Name = "Faculty")]
        public string? Faculty { get; set; }

        [MaxLength(50)]
        [Display(Name = "Course & Year")]
        public string? CourseYear { get; set; }

        [Required, MaxLength(20)]
        [Display(Name = "Vehicle Plate No.")]
        public string VehiclePlateNo { get; set; } = string.Empty;

        [DataType(DataType.Date)]
        [Display(Name = "Registration Expiry Date")]
        public DateTime? RegistrationExpiryDate { get; set; }

        [Required, MaxLength(50)]
        [Display(Name = "Vehicle Type")]
        public string VehicleType { get; set; } = string.Empty;

        [MaxLength(50)]
        [Display(Name = "Maker")]
        public string? Maker { get; set; }

        [MaxLength(30)]
        [Display(Name = "Color")]
        public string? Color { get; set; }

        [Display(Name = "Attached Study Load and Registration")]
        public string? AttachedDocuments { get; set; }

        [Display(Name = "Status")]
        public string Status { get; set; } = "Pending";

        [Display(Name = "Date Created")]
        public DateTime DateCreated { get; set; } = DateTime.Now;

        [Display(Name = "Approved By")]
        public string? ApprovedBy { get; set; }

        [Display(Name = "Approval Date")]
        public DateTime? ApprovalDate { get; set; }

        [Display(Name = "Remarks")]
        public string? Remarks { get; set; }
    }
}
