using System.ComponentModel.DataAnnotations;

namespace MyWebApplication.Models
{
    public class Student
    {
        [Key]
        public int Id { get; set; }

        [Required, MaxLength(25)]
        public string Lastname { get; set; } = "";

        [Required, MaxLength(25)]
        public string? Firstname { get; set; } // non-nullable

        public string? Course { get; set; } // non-nullable

        public string? Email { get; set; } // null

        [Display(Name = "Date Created")]
        public DateTime DateCreated { get; set; } = DateTime.Now;
    }
}
