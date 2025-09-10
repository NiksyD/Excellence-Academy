using MyWebApplication.Models;

namespace MyWebApplication.Services
{
    public interface IFileUploadService
    {
        Task<List<GatePassDocument>> SaveFilesAsync(IFormFileCollection files, int gatePassId);
        Task<bool> DeleteFileAsync(string filePath);
        Task<bool> FileExistsAsync(string filePath);
        string GetFileUrl(string fileName);
    }
}
