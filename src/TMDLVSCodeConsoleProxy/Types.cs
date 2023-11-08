using Microsoft.AspNetCore.Mvc;

namespace TMDLVSCodeConsoleProxy
{
    public class ProxyHeader
    {
        [FromHeader(Name = "X-Proxy-Secret")]
        public string secret { get; set; }
    }

    public class ProxyRequest
    {
        public string connectionString { get; set; }
        public string? vscodeAccessToken { get; set; }
    }
}
