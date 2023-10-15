using System.Data.Common;
using TOM = Microsoft.AnalysisServices.Tabular;

namespace TMDLVSCodeConsoleProxy
{
    public static class ServerManager
    {
        private static Dictionary<string, TOM.Server> knownServers = new Dictionary<string, TOM.Server>();

        public static TOM.Server GetServer(TMDLProxyData proxyData)
        {
            TOM.Server server;
            if (!knownServers.ContainsKey(proxyData.connectionString))
            {
                lock (knownServers)
                {
                    Console.WriteLine("Establishing new connection to " + proxyData.connectionString);
                    server = new TOM.Server();

                    // if an access token is provided from VSCode, we use it to connect to the server
                    if(proxyData.vscodeAccessToken != null)
                    {
                        Console.WriteLine("Using VSCode AccessToken ...");
                        server.AccessToken = new Microsoft.AnalysisServices.AccessToken(proxyData.vscodeAccessToken, DateTime.Now.AddHours(1));
                    }

                    server.Connect(proxyData.connectionString);

                    if(server.Connected && !knownServers.ContainsKey(proxyData.connectionString))
                    {
                        knownServers.Add(proxyData.connectionString, server);
                    }
                }
            }

            server = knownServers[proxyData.connectionString];
            if(!server.Connected)
            {
                Console.WriteLine("Reconnecting to " + proxyData.connectionString);
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