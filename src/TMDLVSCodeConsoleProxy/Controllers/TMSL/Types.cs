namespace TMDLVSCodeConsoleProxy.Controllers.TMSL
{
    public class TMSLProxyRequest : ProxyRequest
    {
    }

    public class TMSLProxyExecuteRequest : TMSLProxyRequest
    {
        public string command { get; set; }
        public bool? analyzeImpactOnly { get; set; }
    }

    public class TMSLProxyException
    {
        public string message { get; set; }
    }

    public class TMSLProxyExecuteResponse
    {
        public string message { get; set; }
        public TMSLProxyException? exception { get; set; }
    }
}
