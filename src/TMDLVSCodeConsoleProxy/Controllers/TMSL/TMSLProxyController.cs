using Microsoft.AspNetCore.Mvc;
using System.Text;

using Microsoft.AnalysisServices;

namespace TMDLVSCodeConsoleProxy.Controllers.TMSL
{
    [ApiController]
    [Route("[controller]")]
    public class TMSLProxyController : ControllerBase
    {
        private readonly ILogger<TMSLProxyController> _logger;

        public TMSLProxyController(ILogger<TMSLProxyController> logger)
        {
            _logger = logger;
        }

        private BadRequestObjectResult handleTMSLException(Exception ex)
        {
            string exceptionMsg;

            if (ex == null)
            {
                exceptionMsg = "NULL Exception!";
            }
            else
            {
                exceptionMsg  = ex.Message;
            }

            TMSLProxyException tmslProxyException = new TMSLProxyException
            {
                message = exceptionMsg
            };
            
            return BadRequest(new TMSLProxyExecuteResponse
            {
                message = "TMSL Execution failed!",
                exception = tmslProxyException
            });
        }

        [HttpPost(Name = "Executecommand")]
        [Route("/tmsl/execute")]
        [Consumes("application/json")]
        public IActionResult Executecommand(
            [FromBody] TMSLProxyExecuteRequest requestBody,
            [FromHeader] ProxyHeader header
        )
        {
            try
            {
                Config.validateHeader(header);

                var server = ServerManager.GetServer(requestBody);

                Microsoft.AnalysisServices.ImpactDetailCollection impactDetails = new Microsoft.AnalysisServices.ImpactDetailCollection();
                var results = server.Execute(requestBody.command, impactDetails, requestBody.analyzeImpactOnly ?? false);
                
                if(results.ContainsErrors)
                {
                    StringBuilder sb = new StringBuilder();
                    foreach(XmlaResult result in results)
                    {
                        foreach (XmlaMessage message in result.Messages)
                        {
                            sb.AppendLine(message.Description);
                        }
                    }
                    throw new Exception(sb.ToString());
                }   
                return Ok("TMSL Command executed successfully!");
            }
            catch (Exception ex)
            {
                return handleTMSLException(ex);
            }
        }
    }
}