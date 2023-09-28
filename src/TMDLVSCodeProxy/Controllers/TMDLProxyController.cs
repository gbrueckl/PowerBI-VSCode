using Microsoft.AnalysisServices.Tabular.Serialization;
using Microsoft.AnalysisServices.Tabular.Tmdl;
using Microsoft.AnalysisServices;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using System.Text;

using TOM = Microsoft.AnalysisServices.Tabular;

using System.Linq;
using Microsoft.AnalysisServices.Tabular;
using System.Text;
using Microsoft.AnalysisServices.Tabular.Serialization;
using Microsoft.AnalysisServices.Core;
using System.Reflection;
using System.Text.Json;
using System.Drawing;
using System.Runtime.CompilerServices;
using System.Reflection.Metadata;
using System.Text.Json.Nodes;

namespace TMDLVSCodeProxy.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TMDLProxyController : ControllerBase
    {
        private static string secret;
        private readonly ILogger<TMDLProxyController> _logger;

        public TMDLProxyController(ILogger<TMDLProxyController> logger)
        {
            _logger = logger;
        }

        public static void SetSecret(string secret)
        {
            TMDLProxyController.secret = secret;
        }

        [HttpGet(Name = "Test")]
        [Route("/tmdl/test")]
        public IActionResult Test()
        {
            return Ok("Hello World!");
        }

        public class TMDLProxyDatabase
        {
            public string name { get; set; }
            public string id { get; set; }
        }
        public class TMDLProxyStreamEntry
        {
            public string logicalPath { get; set; }
            public Int64 size { get; set; }
            public string content { get; set; }
        }
        public class TMDLProxyData
        {
            public string connectionString { get; set; }
            public string accessToken { get; set; }
            public string? datasetName { get; set; }
            public string? localPath { get; set; }

            public TMDLProxyStreamEntry[]? streamEntries { get; set; }
        }

        public class TMDLProxyDataValidation
        {
            public string? localPath { get; set; }
            public TMDLProxyStreamEntry[]? streamEntries { get; set; }
        }

        public class TMDLProxyDataException
        {
            public bool success { get; set; }
            public string message { get; set; }
            public string? path { get; set; }
            public int? lineNumber { get; set; }
            public string? lineText { get; set; }
        }

        public class TMDLProxyHeader
        {
            [FromHeader(Name = "X-TMDLProxy-Secret")]
            public string secret { get; set; }
        }

        private BadRequestObjectResult handleTMDLException(Exception ex)
        {
            if (ex == null)
            {
                return BadRequest(new TMDLProxyDataException
                {
                    success = false,
                    message = "NULL Exception!"
                });
            }
            else if (ex is TmdlFormatException)
            {
                TmdlFormatException fex = (TmdlFormatException)ex;
                return BadRequest(new TMDLProxyDataException
                {
                    success = false,
                    message = fex.Message,
                    lineNumber = fex.LineNumber,
                    lineText = fex.LineText,
                    path = fex.Path
                });
            }
            else if (ex is TmdlAmbiguousSourceException)
            {
                TmdlAmbiguousSourceException asex = (TmdlAmbiguousSourceException)ex;
                return BadRequest(new TMDLProxyDataException
                {
                    success = false,
                    message = asex.ToString()
                });
            }

            return BadRequest(new TMDLProxyDataException
            {
                success = false,
                message = ex.Message
            });
        }

        private void validateHeader(TMDLProxyHeader header)
        {
            if (header == null)
            {
                throw new Exception("No Header or Authentication provided!");
            }

            if (!header.secret.Equals(TMDLProxyController.secret))
            {
                throw new Exception("Invalid Secret!");
            }
        }

        [HttpPost(Name = "GetDatabases")]
        [Route("/tmdl/databases")]
        public IActionResult GetDatabases(
            [FromBody] TMDLProxyData requestBody,
            [FromHeader] TMDLProxyHeader header
        )
        {
            

            var connectionString = requestBody.connectionString;

            try
            {
                this.validateHeader(header);

                using (var server = new TOM.Server())
                {
                    server.AccessToken = new AccessToken(requestBody.accessToken, DateTime.Now.AddHours(1));

                    server.Connect(connectionString);

                    List<TMDLProxyDatabase> dbs = new List<TMDLProxyDatabase>();

                    foreach (TOM.Database db in server.Databases)
                    {
                        dbs.Add(new TMDLProxyDatabase{ name = db.Name, id = db.ID});
                    }
                    return Ok(dbs);
                }
            }
            catch (Exception ex)
            {
                return this.handleTMDLException(ex);
            }
        }

        [HttpPost(Name = "ExportDatasetTMDL")]
        [Route("/tmdl/export")]
        [Consumes("application/json")]
        public IActionResult ExportDatasetTMDL(
            [FromBody] TMDLProxyData requestBody,
            [FromHeader] TMDLProxyHeader header
        )
        {
            var connectionString = requestBody.connectionString;
            var datasetName = requestBody.datasetName;
            var localPath = requestBody.localPath;

            try
            {
                this.validateHeader(header);

                using (var server = new TOM.Server())
                {
                    server.AccessToken = new AccessToken(requestBody.accessToken, DateTime.Now.AddHours(1));

                    server.Connect(connectionString);

                    var database = server.Databases.GetByName(datasetName);

                    Console.WriteLine($"Exporting Dataset '{datasetName}' as TMDL to local folder '{localPath}' ...");

                    TOM.TmdlSerializer.SerializeModelToFolder(database.Model, localPath);

                    Console.WriteLine($"Export successful!");

                    return Ok("Export successful!");
                }
            }
            catch (Exception ex)
            {
                return this.handleTMDLException(ex);
            }
        }


        [HttpPost(Name = "ValidateDatasetTMDL")]
        [Route("/tmdl/validate")]
        public IActionResult ValidateDatasetTMDL(
            [FromBody] TMDLProxyDataValidation requestBody,
            [FromHeader] TMDLProxyHeader header
        )
        {
            var localPath = requestBody.localPath;

            try
            {
                this.validateHeader(header);

                Console.WriteLine($"Validating TMDL from local folder '{localPath}' ...");
                var model = TOM.TmdlSerializer.DeserializeModelFromFolder(localPath);

                return Ok(new TMDLProxyDataException { success = true, message = "Validation successful!" });
            }
            catch (Exception ex) 
            {
                return this.handleTMDLException(ex);
            }
        }

        [HttpPost(Name = "PublishDatasetTMDL")]
        [Route("/tmdl/publish")]
        public IActionResult PublishDatasetTMDL(
            [FromBody] TMDLProxyData requestBody,
            [FromHeader] TMDLProxyHeader header
        )
        {
            var connectionString = requestBody.connectionString;
            var datasetName = requestBody.datasetName;
            var localPath = requestBody.localPath;

            try
            {
                this.validateHeader(header);

                Console.WriteLine($"Publishing TMDL from local folder '{localPath}' to Dataset '{datasetName}' ...");
                var model = TOM.TmdlSerializer.DeserializeModelFromFolder(localPath);

                using (var server = new TOM.Server())
                {
                    server.AccessToken = new AccessToken(requestBody.accessToken, DateTime.Now.AddHours(1));
                    server.Connect(connectionString);

                    using (var remoteDatabase = server.Databases[model.Database.ID])
                    {
                        model.CopyTo(remoteDatabase.Model);

                        remoteDatabase.Model.SaveChanges();
                    }
                    return Ok("Publish successful!");
                }
            }
            catch (Exception ex)
            {
                return this.handleTMDLException(ex);
            }
        }



        [HttpPost(Name = "ExportDatasetTMDLStream")]
        [Route("/tmdl/exportStream")]
        public IActionResult ExportDatasetTMDLStream(
            [FromBody] TMDLProxyData requestBody,
            [FromHeader] TMDLProxyHeader header
        )
        {
            var connectionString = requestBody.connectionString;
            var datasetName = requestBody.datasetName;

            try
            {
                this.validateHeader(header);

                using (var server = new TOM.Server())
                {
                    server.AccessToken = new AccessToken(requestBody.accessToken, DateTime.Now.AddHours(1));

                    server.Connect(connectionString);

                    var database = server.Databases.GetByName(datasetName);

                    var ret = new JsonArray();

                    foreach (MetadataDocument document in database.Model.ToTmdl())
                    {
                        StringBuilder output = new StringBuilder();
                        using (TextWriter writer = new StringWriter(output))
                        {
                            document.WriteTo(writer);
                        }
                        TMDLProxyStreamEntry tmdlEntry = new TMDLProxyStreamEntry
                        {
                            logicalPath = document.LogicalPath,
                            size = output.Length,
                            content = output.ToString()
                        };

                        ret.Add(tmdlEntry);
                    }

                    return Ok(ret);
                }
            }
            catch (Exception ex)
            {
                return this.handleTMDLException(ex);
            }
        }

        [HttpPost(Name = "PublishDatasetTMDLStream")]
        [Route("/tmdl/publishStream")]
        public IActionResult PublishDatasetTMDLStream(
            [FromBody] TMDLProxyData requestBody,
            [FromHeader] TMDLProxyHeader header
        )
        {
            var connectionString = requestBody.connectionString;
            var datasetName = requestBody.datasetName;
            var localPath = requestBody.localPath;
            var streamEntries = requestBody.streamEntries;

            try
            {
                this.validateHeader(header);

                var context = MetadataSerializationContext.Create(MetadataSerializationStyle.Tmdl);

                foreach (var entry in streamEntries)
                {
                    context.ReadFromDocument(entry.logicalPath, new MemoryStream(Encoding.UTF8.GetBytes(entry.content)));
                }

                var model = context.ToModel();

                Console.WriteLine($"Publishing TMDL from Stream to Dataset '{datasetName}' ...");

                using (var server = new TOM.Server())
                {
                    server.AccessToken = new AccessToken(requestBody.accessToken, DateTime.Now.AddHours(1));
                    server.Connect(connectionString);

                    using (var remoteDatabase = server.Databases[model.Database.ID])
                    {
                        model.CopyTo(remoteDatabase.Model);

                        remoteDatabase.Model.SaveChanges();
                    }
                    return Ok("Publish Stream successful!");
                }
            }
            catch (Exception ex)
            {
                return this.handleTMDLException(ex);
            }
        }

        [HttpPost(Name = "ValidateDatasetTMDLStream")]
        [Route("/tmdl/validateStream")]
        public IActionResult ValidateDatasetTMDLStream(
            [FromBody] TMDLProxyDataValidation requestBody,
            [FromHeader] TMDLProxyHeader header
        )
        {
            var streamEntries = requestBody.streamEntries;

            try
            {
                this.validateHeader(header);

                var context = MetadataSerializationContext.Create(MetadataSerializationStyle.Tmdl);

                foreach (var entry in streamEntries)
                {
                    context.ReadFromDocument(entry.logicalPath, new MemoryStream(Encoding.UTF8.GetBytes(entry.content)));
                }

                Console.WriteLine($"Validating TMDL Stream ...");
                var model = context.ToModel();

                return Ok("Validation successful!");
            }
            catch (Exception ex)
            {
                return this.handleTMDLException(ex);
            }
        }
    }
}