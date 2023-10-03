using TOM = Microsoft.AnalysisServices.Tabular;

namespace TMDLVSCodeConsoleProxy
{
    public static class ServerManager
    {
        private static Dictionary<string, TOM.Server> knownServers = new Dictionary<string, TOM.Server>();

        public static TOM.Server GetServer(string connectionString)
        {
            if(knownServers.ContainsKey(connectionString)) return knownServers[connectionString];

            TOM.Server server = new TOM.Server();
            server.Connect(connectionString);

            knownServers.Add(connectionString, server);

            return server;
        }
    }
}