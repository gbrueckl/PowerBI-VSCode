using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace TMDLVSCodeProxy.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TMDLProxytController : ControllerBase
    {

        private readonly ILogger<TMDLProxytController> _logger;

        public TMDLProxytController(ILogger<TMDLProxytController> logger)
        {
            _logger = logger;
        }

        [HttpGet(Name = "Test")]
        [Route("/tmdl/test")]
        [EnableCors("AllowAll")]
        public string Test()
        {
            return "Hello World!";
        }

        [HttpPost(Name = "SerializeDatasetTMDL")]
        [Route("/tmdl/serialize")]
        public string SerializeDatasetTMDL(
            [FromBody] string body
            )
        {
            return body;
        }


        [HttpPost(Name = "DeserializeDatasetTMDL")]
        [Route("/tmdl/deserialize")]
        public string DeserializeDatasetTMDL(
            [FromBody] string body
            )
        {
            return body;
        }

    }
}