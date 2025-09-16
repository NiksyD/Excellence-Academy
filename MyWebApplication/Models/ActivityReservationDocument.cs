using System.ComponentModel.DataAnnotations;

namespace MyWebApplication.Models
{
    public class ActivityReservationDocument
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ActivityReservationId { get; set; }

        [Required, MaxLength(255)]
        [Display(Name = "File Name")]
        public string FileName { get; set; } = string.Empty;

        [Required, MaxLength(255)]
        [Display(Name = "Stored File Name")]
        public string StoredFileName { get; set; } = string.Empty;

        [Required, MaxLength(100)]
        [Display(Name = "Content Type")]
        public string ContentType { get; set; } = string.Empty;

        [Required]
        [Display(Name = "File Size")]
        public long FileSize { get; set; }

        [Required, MaxLength(500)]
        [Display(Name = "File Path")]
        public string FilePath { get; set; } = string.Empty;

        [Required]
        [Display(Name = "Uploaded At")]
        public DateTime UploadedAt { get; set; } = DateTime.Now;

        // Navigation property
        public virtual ActivityReservation ActivityReservation { get; set; } = null!;
    }
}
