using System.ComponentModel.DataAnnotations;

namespace MyWebApplication.Models
{
    public class ActivityReservation
    {
        [Key]
        public int Id { get; set; }

        [Required, MaxLength(200)]
        [Display(Name = "Name of Organization")]
        public string OrganizationName { get; set; } = string.Empty;

        [Required]
        [Display(Name = "Form Date")]
        [DataType(DataType.Date)]
        public DateTime FormDate { get; set; } = DateTime.Now;

        [Required, MaxLength(200)]
        [Display(Name = "Activity Title")]
        public string ActivityTitle { get; set; } = string.Empty;

        [Required, MaxLength(100)]
        [Display(Name = "Venue")]
        public string Venue { get; set; } = string.Empty;

        [Required]
        [Display(Name = "Date Needed")]
        [DataType(DataType.Date)]
        public DateTime DateNeeded { get; set; }

        [Required]
        [Display(Name = "Time From")]
        [DataType(DataType.Time)]
        public TimeSpan TimeFrom { get; set; }

        [Required]
        [Display(Name = "Time To")]
        [DataType(DataType.Time)]
        public TimeSpan TimeTo { get; set; }

        [Required, MaxLength(500)]
        [Display(Name = "Participants")]
        public string Participants { get; set; } = string.Empty;

        [MaxLength(100)]
        [Display(Name = "Speaker")]
        public string? Speaker { get; set; }

        [Required]
        [Display(Name = "Purpose/Objective")]
        public string PurposeObjective { get; set; } = string.Empty;

        [Display(Name = "Equipment & Other Facilities Needed")]
        public string? EquipmentFacilitiesNeeded { get; set; }

        [Required, MaxLength(100)]
        [Display(Name = "Nature of Activity")]
        public string NatureOfActivity { get; set; } = string.Empty;

        [Required, MaxLength(100)]
        [Display(Name = "Source of Funds")]
        public string SourceOfFunds { get; set; } = string.Empty;


        [Display(Name = "Status")]
        public string Status { get; set; } = "Pending";

        // Owner/User Reference
        [Display(Name = "User ID")]
        public string? UserId { get; set; }

        [Display(Name = "Date Created")]
        public DateTime DateCreated { get; set; } = DateTime.Now;

        [Display(Name = "Approved By")]
        public string? ApprovedBy { get; set; }

        [Display(Name = "Approval Date")]
        public DateTime? ApprovalDate { get; set; }

        [Display(Name = "Remarks")]
        public string? Remarks { get; set; }

        // Navigation property for file attachments
        public virtual ICollection<ActivityReservationDocument> Documents { get; set; } = new List<ActivityReservationDocument>();
    }
}
