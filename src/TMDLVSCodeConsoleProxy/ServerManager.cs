using Microsoft.AnalysisServices.Tabular;
using Microsoft.AnalysisServices;
using System.Data.Common;
using TOM = Microsoft.AnalysisServices.Tabular;

namespace TMDLVSCodeConsoleProxy
{
    public static class ServerManager
    {
        private static Dictionary<string, TOM.Server> knownServers = new Dictionary<string, TOM.Server>();

        public static TOM.Server GetServer(TMDLProxyData proxyData)
        {
            return GetServer(proxyData.connectionString, proxyData.vscodeAccessToken);
        }
        public static TOM.Server GetServer(string connectionString, string vscodeAccessToken = null)
        {
            TOM.Server server;
            if (!knownServers.ContainsKey(connectionString))
            {
                lock (knownServers)
                {
                    Console.WriteLine("Establishing new connection to " + connectionString);
                    server = new TOM.Server();

                    // if an access token is provided from VSCode, we use it to connect to the server
                    if(vscodeAccessToken != null)
                    {
                        Console.WriteLine("Using VSCode AccessToken ...");
                        server.AccessToken = new Microsoft.AnalysisServices.AccessToken(vscodeAccessToken, DateTime.Now.AddHours(1));
                    }

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

        public static TOM.Database GetDatabase(TMDLProxyData proxyData, Boolean createIfNotExists = false)
        {
            DbConnectionStringBuilder builder = new DbConnectionStringBuilder();
            builder.ConnectionString = proxyData.connectionString;

            string databaseName = "";

            if (builder.TryGetValue("initial catalog", out var data))
            {
                databaseName = data.ToString();
            }
            else
            {
                throw new Exception("Database not provided in connection string! Please add 'initial catalog=...;'");
            }

            // remove database from connectionstring as it would fail if the DB does not yet exist (e.g. for a fresh deployment)
            builder.Remove("initial catalog");

            TOM.Server server = GetServer(builder.ConnectionString, proxyData.vscodeAccessToken);

            TOM.Database targetDatabase = null;
            if (!server.Databases.ContainsName(databaseName))
            {
                if (createIfNotExists)
                {
                    Console.WriteLine("Creating new database '" + databaseName + "' ...");
                    targetDatabase = new TOM.Database(databaseName);
                    targetDatabase.Model = new Model();

                    server.Databases.Add(targetDatabase);
                    targetDatabase.Update(UpdateOptions.ExpandFull);
                }
                else
                {
                    // this will always throw an exception as the database does not exist - intentionally!
                    // this way we get the original exception message from the server
                    targetDatabase = server.Databases.GetByName(databaseName);
                    throw new Exception("Database '" + databaseName + "' does not exist!");
                }
            }
            else
            {
                targetDatabase = server.Databases.GetByName(databaseName);
            }
            return targetDatabase;
        }
    }
}