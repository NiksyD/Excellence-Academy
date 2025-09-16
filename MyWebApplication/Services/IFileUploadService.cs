using MyWebApplication.Models;

namespace MyWebApplication.Services
{
    public interface IFileUploadService
    {
        Task<List<GatePassDocument>> SaveFilesAsync(IFormFileCollection files, int gatePassId);
        Task<List<LockerRequestDocument>> SaveLockerRequestFilesAsync(IFormFileCollection files, int lockerRequestId);
        Task<List<ActivityReservationDocument>> SaveActivityReservationFilesAsync(IFormFileCollection files, int activityReservationId);
        Task<bool> DeleteFileAsync(string filePath);
        Task<bool> FileExistsAsync(string filePath);
        string GetFileUrl(string fileName);
        string GetLockerRequestFileUrl(string fileName);
        string GetActivityReservationFileUrl(string fileName);
    }
}
