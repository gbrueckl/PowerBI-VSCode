using System.Data.Common;
using TOM = Microsoft.AnalysisServices.Tabular;

namespace TMDLVSCodeConsoleProxy
{
    public static class ServerManager
    {
        private static Dictionary<string, TOM.Server> knownServers = new Dictionary<string, TOM.Server>();

        public static TOM.Server GetServer(string connectionString)
        {
            TOM.Server server;
            if (!knownServers.ContainsKey(connectionString))
            {
                lock (knownServers)
                {
                    Console.WriteLine("Establishing new connection to " + connectionString);
                    server = new TOM.Server();
                    server.Connect(connectionString);

                    if(server.Connected && !knownServers.ContainsKey(connectionString))
                    {
                        knownServers.Add(connectionString, server);
                    }
                }
            }

            server = knownServers[connectionString];
            if(!server.Connected)
            {
                Console.WriteLine("Reconnecting to " + connectionString);
                server.Reconnect();
            }
            return server;
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