using System.Data.Common;
using System.Runtime.CompilerServices;
using TOM = Microsoft.AnalysisServices.Tabular;

namespace TMDLVSCodeConsoleProxy
{
    public static class ServerManager
    {
        private static Dictionary<string, TOM.Server> knownServers = new Dictionary<string, TOM.Server>();

        public static TOM.Server GetServer(string connectionString)
        {
            if (!knownServers.ContainsKey(connectionString))
            {
                lock (knownServers)
                {
                    TOM.Server server = new TOM.Server();
                    server.Connect(connectionString);

                    if(server.Connected)
                    {
                        knownServers.Add(connectionString, server);
                    }
                }
            }

            return knownServers[connectionString];
        }

        public static string GetDataSource(string connectionString)
        {
            DbConnectionStringBuilder builder = new DbConnectionStringBuilder();
            builder.ConnectionString = connectionString;

            if(builder.TryGetValue("data source", out var data))
            {
                return data.ToString();
            }
            throw new Exception("Property 'data source' not found in connection string!");
        }
    }
}