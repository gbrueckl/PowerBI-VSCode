using Microsoft.AnalysisServices.Tabular.Serialization;
using Microsoft.AnalysisServices.Tabular.Tmdl;
using Microsoft.AspNetCore.Mvc;
using System.Text;

using Microsoft.AnalysisServices.Tabular;
using System.Text.Json.Nodes;

namespace TMDLVSCodeConsoleProxy.Controllers.TMDL
{
    [ApiController]
    [Route("[controller]")]
    public class TMDLProxyController : ControllerBase
    {
        private readonly ILogger<TMDLProxyController> _logger;

        public TMDLProxyController(ILogger<TMDLProxyController> logger)
        {
            _logger = logger;
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

        [HttpPost(Name = "GetDatabases")]
        [Route("/tmdl/databases")]
        public IActionResult GetDatabases(
            [FromBody] TMDLProxyData requestBody,
            [FromHeader] ProxyHeader header
        )
        {
            try
            {
                Config.validateHeader(header);

                var server = ServerManager.GetServer(requestBody);

                List<TMDLProxyDatabase> dbs = new List<TMDLProxyDatabase>();

                foreach (Database db in server.Databases)
                {
                    dbs.Add(new TMDLProxyDatabase { name = db.Name, id = db.ID });
                }
                return Ok(dbs);
            }
            catch (Exception ex)
            {
                return handleTMDLException(ex);
            }
        }

        [HttpPost(Name = "ExportDatasetTMDL")]
        [Route("/tmdl/export")]
        [Consumes("application/json")]
        public IActionResult ExportDatasetTMDL(
            [FromBody] TMDLProxyData requestBody,
            [FromHeader] ProxyHeader header
        )
        {
            var localPath = requestBody.localPath;

            try
            {
                Config.validateHeader(header);

                var database = ServerManager.GetDatabase(requestBody, false);

                Console.WriteLine($"Exporting Dataset '{database.Name}' as TMDL to local folder '{localPath}' ...");

                TmdlSerializer.SerializeModelToFolder(database.Model, localPath);

                Console.WriteLine($"Export successful!");

                return Ok("Export successful!");
            }
            catch (Exception ex)
            {
                return handleTMDLException(ex);
            }
        }


        [HttpPost(Name = "ValidateDatasetTMDL")]
        [Route("/tmdl/validate")]
        public IActionResult ValidateDatasetTMDL(
            [FromBody] TMDLProxyDataValidation requestBody,
            [FromHeader] ProxyHeader header
        )
        {
            var localPath = requestBody.localPath;

            try
            {
                Config.validateHeader(header);

                Console.WriteLine($"Validating TMDL from local folder '{localPath}' ...");
                var model = TmdlSerializer.DeserializeModelFromFolder(localPath);

                return Ok("Validation successful!");
            }
            catch (Exception ex)
            {
                return handleTMDLException(ex);
            }
        }

        [HttpPost(Name = "PublishDatasetTMDL")]
        [Route("/tmdl/publish")]
        public IActionResult PublishDatasetTMDL(
            [FromBody] TMDLProxyData requestBody,
            [FromHeader] ProxyHeader header
        )
        {
            var localPath = requestBody.localPath;

            try
            {
                Config.validateHeader(header);

                Console.WriteLine($"Publishing TMDL from local folder '{localPath}' ...");
                var model = TmdlSerializer.DeserializeModelFromFolder(localPath);

                Database targetDatabase = ServerManager.GetDatabase(requestBody, true);
                Console.WriteLine($"Target database is '{targetDatabase.Name}'");

                model.CopyTo(targetDatabase.Model);

                targetDatabase.Model.SaveChanges();

                return Ok("Publish successful!");
            }
            catch (Exception ex)
            {
                return handleTMDLException(ex);
            }
        }



        [HttpPost(Name = "ExportDatasetTMDLStream")]
        [Route("/tmdl/exportStream")]
        public IActionResult ExportDatasetTMDLStream(
            [FromBody] TMDLProxyData requestBody,
            [FromHeader] ProxyHeader header
        )
        {
            try
            {
                Config.validateHeader(header);

                var ret = new JsonArray();
                var database = ServerManager.GetDatabase(requestBody, false);

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
            catch (Exception ex)
            {
                return handleTMDLException(ex);
            }
        }

        [HttpPost(Name = "PublishDatasetTMDLStream")]
        [Route("/tmdl/publishStream")]
        public IActionResult PublishDatasetTMDLStream(
            [FromBody] TMDLProxyData requestBody,
            [FromHeader] ProxyHeader header
        )
        {
            var streamEntries = requestBody.streamEntries;

            try
            {
                Config.validateHeader(header);

                var context = MetadataSerializationContext.Create(MetadataSerializationStyle.Tmdl);

                foreach (var entry in streamEntries)
                {
                    context.ReadFromDocument(entry.logicalPath, new MemoryStream(Encoding.UTF8.GetBytes(entry.content)));
                }

                var model = context.ToModel();

                Console.WriteLine($"Publishing TMDL from Stream ...");

                Database targetDatabase = ServerManager.GetDatabase(requestBody, true);
                Console.WriteLine($"Target database is '{targetDatabase.Name}'");

                model.CopyTo(targetDatabase.Model);

                targetDatabase.Model.SaveChanges();
                return Ok("Publish successful!");
            }
            catch (Exception ex)
            {
                return handleTMDLException(ex);
            }
        }

        [HttpPost(Name = "ValidateDatasetTMDLStream")]
        [Route("/tmdl/validateStream")]
        public IActionResult ValidateDatasetTMDLStream(
            [FromBody] TMDLProxyDataValidation requestBody,
            [FromHeader] ProxyHeader header
        )
        {
            var streamEntries = requestBody.streamEntries;

            try
            {
                Config.validateHeader(header);

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
                return handleTMDLException(ex);
            }
        }
    }
}