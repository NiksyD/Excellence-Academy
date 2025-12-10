using Microsoft.AspNetCore.Identity;

namespace MyWebApplication.Models
{
    public class ApplicationUser : IdentityUser
    {
        [PersonalData]
        public string Name { get; set; }
    }
}
