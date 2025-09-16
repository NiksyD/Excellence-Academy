using MyWebApplication.Models;

namespace MyWebApplication.Services
{
    public class FileUploadService : IFileUploadService
    {
        private readonly IWebHostEnvironment _environment;
        private readonly string _gatePassUploadPath;
        private readonly string _lockerRequestUploadPath;
        private readonly string _activityReservationUploadPath;

        public FileUploadService(IWebHostEnvironment environment)
        {
            _environment = environment;
            _gatePassUploadPath = Path.Combine(_environment.WebRootPath, "uploads", "gatepasses");
            _lockerRequestUploadPath = Path.Combine(_environment.WebRootPath, "uploads", "lockerrequests");
            _activityReservationUploadPath = Path.Combine(_environment.WebRootPath, "uploads", "activityreservations");
            
            // Ensure upload directories exist
            if (!Directory.Exists(_gatePassUploadPath))
            {
                Directory.CreateDirectory(_gatePassUploadPath);
            }
            
            if (!Directory.Exists(_lockerRequestUploadPath))
            {
                Directory.CreateDirectory(_lockerRequestUploadPath);
            }
            
            if (!Directory.Exists(_activityReservationUploadPath))
            {
                Directory.CreateDirectory(_activityReservationUploadPath);
            }
        }

        public async Task<List<GatePassDocument>> SaveFilesAsync(IFormFileCollection files, int gatePassId)
        {
            var documents = new List<GatePassDocument>();

            foreach (var file in files)
            {
                if (file.Length > 0)
                {
                    // Generate unique filename
                    var fileExtension = Path.GetExtension(file.FileName);
                    var uniqueFileName = $"{Guid.NewGuid()}{fileExtension}";
                    var filePath = Path.Combine(_gatePassUploadPath, uniqueFileName);

                    // Save file to disk
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    // Create document record
                    var document = new GatePassDocument
                    {
                        GatePassId = gatePassId,
                        FileName = file.FileName,
                        StoredFileName = uniqueFileName,
                        FilePath = $"uploads/gatepasses/{uniqueFileName}",
                        FileSize = file.Length,
                        ContentType = file.ContentType,
                        UploadedAt = DateTime.Now
                    };

                    documents.Add(document);
                }
            }

            return documents;
        }

        public async Task<List<LockerRequestDocument>> SaveLockerRequestFilesAsync(IFormFileCollection files, int lockerRequestId)
        {
            var documents = new List<LockerRequestDocument>();

            foreach (var file in files)
            {
                if (file.Length > 0)
                {
                    // Generate unique filename
                    var fileExtension = Path.GetExtension(file.FileName);
                    var uniqueFileName = $"{Guid.NewGuid()}{fileExtension}";
                    var filePath = Path.Combine(_lockerRequestUploadPath, uniqueFileName);

                    // Save file to disk
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    // Create document record
                    var document = new LockerRequestDocument
                    {
                        LockerRequestId = lockerRequestId,
                        FileName = file.FileName,
                        StoredFileName = uniqueFileName,
                        FilePath = $"uploads/lockerrequests/{uniqueFileName}",
                        FileSize = file.Length,
                        ContentType = file.ContentType,
                        UploadedAt = DateTime.Now
                    };

                    documents.Add(document);
                }
            }

            return documents;
        }

        public async Task<bool> DeleteFileAsync(string filePath)
        {
            try
            {
                var fullPath = Path.Combine(_environment.WebRootPath, filePath);
                if (File.Exists(fullPath))
                {
                    await Task.Run(() => File.Delete(fullPath));
                    return true;
                }
                return false;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> FileExistsAsync(string filePath)
        {
            try
            {
                var fullPath = Path.Combine(_environment.WebRootPath, filePath);
                return await Task.Run(() => File.Exists(fullPath));
            }
            catch
            {
                return false;
            }
        }

        public string GetFileUrl(string fileName)
        {
            return $"/uploads/gatepasses/{fileName}";
        }

        public string GetLockerRequestFileUrl(string fileName)
        {
            return $"/uploads/lockerrequests/{fileName}";
        }

        public async Task<List<ActivityReservationDocument>> SaveActivityReservationFilesAsync(IFormFileCollection files, int activityReservationId)
        {
            var documents = new List<ActivityReservationDocument>();

            foreach (var file in files)
            {
                if (file.Length > 0)
                {
                    // Generate unique filename
                    var fileExtension = Path.GetExtension(file.FileName);
                    var uniqueFileName = $"{Guid.NewGuid()}{fileExtension}";
                    var filePath = Path.Combine(_activityReservationUploadPath, uniqueFileName);

                    // Save file to disk
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    // Create document record
                    var document = new ActivityReservationDocument
                    {
                        ActivityReservationId = activityReservationId,
                        FileName = file.FileName,
                        StoredFileName = uniqueFileName,
                        FilePath = $"uploads/activityreservations/{uniqueFileName}",
                        FileSize = file.Length,
                        ContentType = file.ContentType,
                        UploadedAt = DateTime.Now
                    };

                    documents.Add(document);
                }
            }

            return documents;
        }

        public string GetActivityReservationFileUrl(string fileName)
        {
            return $"/uploads/activityreservations/{fileName}";
        }
    }
}
