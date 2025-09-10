using MyWebApplication.Models;

namespace MyWebApplication.Services
{
    public class FileUploadService : IFileUploadService
    {
        private readonly IWebHostEnvironment _environment;
        private readonly string _uploadPath;

        public FileUploadService(IWebHostEnvironment environment)
        {
            _environment = environment;
            _uploadPath = Path.Combine(_environment.WebRootPath, "uploads", "gatepasses");
            
            // Ensure upload directory exists
            if (!Directory.Exists(_uploadPath))
            {
                Directory.CreateDirectory(_uploadPath);
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
                    var filePath = Path.Combine(_uploadPath, uniqueFileName);

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
    }
}
