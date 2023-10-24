using Microsoft.AspNetCore.Mvc;

namespace TMDLVSCodeConsoleProxy
{
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
        public string? localPath { get; set; }

        public TMDLProxyStreamEntry[]? streamEntries { get; set; }
        public string? vscodeAccessToken { get; set; }
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
}
