using System.ComponentModel.DataAnnotations;

namespace MyWebApplication.Models
{
    public class LockerRequest
    {
        [Key]
        public int Id { get; set; }

        [Required, MaxLength(100)]
        [Display(Name = "Full Name")]
        public string Name { get; set; } = string.Empty;

        [Required, MaxLength(20)]
        [Display(Name = "ID Number")]
        public string IdNumber { get; set; } = string.Empty;

        [Required, MaxLength(20)]
        [Display(Name = "Locker Number")]
        public string LockerNumber { get; set; } = string.Empty;

        [Required, MaxLength(50)]
        [Display(Name = "Semester")]
        public string Semester { get; set; } = string.Empty;

        [Required, MaxLength(15)]
        [Display(Name = "Contact Number")]
        [Phone]
        public string ContactNumber { get; set; } = string.Empty;

        [Required(ErrorMessage = "You must accept the Terms of Service to proceed")]
        [Display(Name = "Terms of Service Accepted")]
        public bool TermsAccepted { get; set; } = false;

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

        // Navigation property for documents
        public virtual ICollection<LockerRequestDocument> Documents { get; set; } = new List<LockerRequestDocument>();
    }
}
