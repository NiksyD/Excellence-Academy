using System.ComponentModel.DataAnnotations;

namespace MyWebApplication.Models
{
    public class LockerRequestDocument
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int LockerRequestId { get; set; }

        [Required, MaxLength(255)]
        public string FileName { get; set; } = string.Empty;

        [Required, MaxLength(255)]
        public string StoredFileName { get; set; } = string.Empty;

        [Required, MaxLength(100)]
        public string ContentType { get; set; } = string.Empty;

        [Required]
        public long FileSize { get; set; }

        [Required, MaxLength(500)]
        public string FilePath { get; set; } = string.Empty;

        public DateTime UploadedAt { get; set; } = DateTime.Now;

        // Navigation property
        public virtual LockerRequest LockerRequest { get; set; } = null!;
    }
}
