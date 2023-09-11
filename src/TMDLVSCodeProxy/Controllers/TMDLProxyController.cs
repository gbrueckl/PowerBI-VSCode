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

        public class TMDLProxyData
        {
            public string connectionString { get; set; }
            public string accessToken { get; set; }
            public string datasetName { get; set; }
            public string localPath { get; set; }
        }

        public class TMDLProxyDataValidation
        {
            public string localPath { get; set; }
        }

        public class TMDLProxyHeader
        {
            [FromHeader(Name = "X-TMDLProxy-Secret")]
            public string secret { get; set; }
        }

        [HttpPost(Name = "SerializeDatasetTMDL")]
        [Route("/tmdl/serialize")]
        [Consumes("application/json")]
        public IActionResult SerializeDatasetTMDL(
            [FromBody] TMDLProxyData requestBody,
            [FromHeader] TMDLProxyHeader header
            )
        {
            if (!header.secret.Equals(TMDLProxyController.secret))
            {
                return BadRequest("Invalid Secret!");
            }

            var connectionString = requestBody.connectionString;
            var datasetName = requestBody.datasetName;
            var localPath = requestBody.localPath;

            try
            {
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
                return BadRequest(ex.Message);
            }
        }


        [HttpPost(Name = "ValidateDatasetTMDL")]
        [Route("/tmdl/validate")]
        public IActionResult ValidateDatasetTMDL(
            [FromBody] TMDLProxyDataValidation requestBody,
            [FromHeader] TMDLProxyHeader header
            )
        {
            if (!header.secret.Equals(TMDLProxyController.secret))
            {
                return BadRequest("Invalid Secret!");
            }

            var localPath = requestBody.localPath;

            try
            {
                Console.WriteLine($"Validating TMDL from local folder '{localPath}' ...");
                var model = TOM.TmdlSerializer.DeserializeModelFromFolder(localPath);

                return Ok("Validation successful!");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

            [HttpPost(Name = "PublishDatasetTMDL")]
        [Route("/tmdl/publish")]
        public IActionResult PublishDatasetTMDL(
            [FromBody] TMDLProxyData requestBody,
            [FromHeader] TMDLProxyHeader header
            )
        {
            if (!header.secret.Equals(TMDLProxyController.secret))
            {
                return BadRequest("Invalid Secret!");
            }

            var connectionString = requestBody.connectionString;
            var datasetName = requestBody.datasetName;
            var localPath = requestBody.localPath;

            try
            {
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
                return BadRequest(ex.Message);
            }
        }
    }
}