using Microsoft.AspNetCore.Identity;

namespace MyWebApplication.Models
{
    public class ApplicationUser : IdentityUser
    {
        [PersonalData]
        public string Name { get; set; } = string.Empty;

        [PersonalData]
        public byte[]? ProfilePicture { get; set; }
    }
}
