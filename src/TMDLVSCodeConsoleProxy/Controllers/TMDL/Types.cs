using Microsoft.AspNetCore.Mvc;

namespace TMDLVSCodeConsoleProxy.Controllers.TMDL
{
    public class TMDLProxyRequest : ProxyRequest
    {
    }

    public class TMDLProxyData : TMDLProxyRequest
    {
        public string? localPath { get; set; }

        public TMDLProxyStreamEntry[]? streamEntries { get; set; }
    }

    public class TMDLProxyDatabase
    {
        public string name { get; set; }
        public string id { get; set; }
    }
    public class TMDLProxyStreamEntry
    {
        public string logicalPath { get; set; }
        public long size { get; set; }
        public string content { get; set; }
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


}
