using Microsoft.AnalysisServices.Tabular.Tmdl;
using Microsoft.AspNetCore.Mvc;
using System.Text;

using TOM = Microsoft.AnalysisServices.Tabular;

using Microsoft.AnalysisServices.Tabular;

namespace TMDLVSCodeConsoleProxy.Controllers.TOM
{
    [ApiController]
    [Route("[controller]")]
    public class TOMProxyController : ControllerBase
    {
        private readonly ILogger<TOMProxyController> _logger;

        public TOMProxyController(ILogger<TOMProxyController> logger)
        {
            _logger = logger;
        }

        private BadRequestObjectResult handleTOMException(Exception ex)
        {
            if (ex == null)
            {
                return BadRequest(new TOMProxyException
                {
                    message = "NULL Exception!"
                });
            }
            else if (ex is TmdlFormatException)
            {
                // custom exception handling
            }


            return BadRequest(new TOMProxyException
            {
                message = ex.Message
            });
        }

        [HttpGet(Name = "Test")]
        [Route("/tom/test")]
        public IActionResult Test()
        {
            try
            {
                Server s = new Server();

                return Ok("Proxy is running!");
            }
            catch (Exception ex)
            {
                return handleTOMException(ex);
            }
        }

        [HttpGet(Name = "TestConnection")]
        [Route("/tom/testConnection")]
        public IActionResult TestConnection(
            [FromBody] TOMProxyRequest requestBody,
            [FromHeader] ProxyHeader header
        )
        {
            try
            {
                Config.validateHeader(header);

                var server = ServerManager.GetServer(requestBody);

                return Ok("Successfully connected to '" + server.Name + "'!");
            }
            catch (Exception ex)
            {
                return handleTOMException(ex);
            }
        }

        [HttpPost(Name = "BackupDatabases")]
        [Route("/tom/backup")]
        [Consumes("application/json")]
        public IActionResult BackupDatabase(
            [FromBody] TOMProxyBackupRequest requestBody,
            [FromHeader] ProxyHeader header
        )
        {
            try
            {
                Config.validateHeader(header);

                var database = ServerManager.GetDatabase(requestBody, false);

                database.Backup(
                    file: requestBody.fileName,
                    allowOverwrite: requestBody.allowOverwrite ?? default,
                    backupRemotePartitions: requestBody.backupRemotePartitions ?? default,
                    locations: default, //requestBody.locations ?? default,
                    applyCompression: requestBody.applyCompression ?? default,
                    password: requestBody.password ?? default
                );
                return Ok("Backup succeeded!");
            }
            catch (Exception ex)
            {
                return handleTOMException(ex);
            }
        }

        [HttpPost(Name = "RestoreDatabase")]
        [Route("/tom/restore")]
        [Consumes("application/json")]
        public IActionResult RestoreDatabase(
            [FromBody] TOMProxyRestoreRequest requestBody,
            [FromHeader] ProxyHeader header
        )
        {
            try
            {
                Config.validateHeader(header);

                var server = ServerManager.GetServer(requestBody);
  
                server.Restore(
                    file: requestBody.fileName,
                    databaseName: requestBody.databaseName ?? default,
                    allowOverwrite: requestBody.allowOverwrite ?? default,
                    locations: default,
                    security: default,
                    password: requestBody.password ?? default
                );
                return Ok("Restore succeeded!");
            }
            catch (Exception ex)
            {
                return handleTOMException(ex);
            }
        }


    }
}