using Microsoft.AnalysisServices;
using Microsoft.AspNetCore.Mvc;
using TMDLVSCodeConsoleProxy.Controllers.TMDL;

namespace TMDLVSCodeConsoleProxy.Controllers.TOM
{
    public class TOMProxyRequest : ProxyRequest
    {
    }

    public class TOMProxyBackupLocation
    {
        public string file { get; set; }

        public string dataSourceID { get; set; }
    }

    public class TOMProxyBackupRequest : TOMProxyRequest
    {
        public string fileName { get; set; }
        public bool? allowOverwrite { get; set; }
        public bool? backupRemotePartitions { get; set; }
        public TOMProxyBackupLocation[]? locations { get; set; }
        public bool? applyCompression { get; set; }
        public string? password { get; set; }
    }

    public class TOMProxyRestoreRequest : TOMProxyRequest
    {
        public string fileName { get; set; }
        public bool? allowOverwrite { get; set; }
        public string? databaseName { get; set; }

        public string? password { get; set; }
    }



    public class TOMProxyException
    {
        public string message { get; set; }
    }
}
