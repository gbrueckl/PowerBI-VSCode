using Microsoft.AnalysisServices.Tabular;
using Microsoft.AnalysisServices;
using System.Data.Common;
using TOM = Microsoft.AnalysisServices.Tabular;

namespace TMDLVSCodeConsoleProxy
{
    public static class ServerManager
    {
        private static Dictionary<string, TOM.Server> knownServers = new Dictionary<string, TOM.Server>();

        public static TOM.Server GetServer(ProxyRequest proxyRequest)
        {
            return GetServer(proxyRequest.connectionString, proxyRequest.vscodeAccessToken);
        }
        public static TOM.Server GetServer(string connectionString, string? vscodeAccessToken = null)
        {
            TOM.Server server;
            string databaseName; // not used but mandatory for out parameter
            RemoveInitialCatalog(ref connectionString, out databaseName);

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
                        server.AccessToken = new AccessToken(vscodeAccessToken, DateTime.Now.AddHours(1));
                    }

                    server.Connect(connectionString);

                    if(server.Connected && !knownServers.ContainsKey(connectionString))
                    {
                        Console.WriteLine("Connected to " + connectionString);
                        knownServers.Add(connectionString, server);
                    }
                    else
                    {
                        throw new Exception("Could not connect to " + connectionString);
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

        public static TOM.Database GetDatabase(ProxyRequest proxyRequest, bool createIfNotExists = false)
        {
            return GetDatabase(proxyRequest.connectionString, proxyRequest.vscodeAccessToken, createIfNotExists);
        }

        public static TOM.Database GetDatabase(string connectionString, string? vscodeAccessToken = null, bool createIfNotExists = false)
        {
            string databaseName = "";

            // remove database from connectionstring as it would fail if the DB does not yet exist (e.g. for a fresh deployment or restore)
            RemoveInitialCatalog(ref connectionString, out databaseName);

            if(databaseName == "")
            {
                throw new Exception("Database not provided in connection string! Please add 'initial catalog=...;'");
            }

            TOM.Server server = GetServer(connectionString, vscodeAccessToken);

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
            targetDatabase.Refresh(true);
            return targetDatabase;
        }

        public static void RemoveInitialCatalog(ref string connectionString, out string initialCatalog)
        {
            DbConnectionStringBuilder builder = new DbConnectionStringBuilder();
            builder.ConnectionString = connectionString;

            if (builder.TryGetValue("initial catalog", out var data))
            {
                initialCatalog = data.ToString();
                builder.Remove("initial catalog");
            }
            else
            {
                initialCatalog = "";
            }

            connectionString = builder.ConnectionString;
        }   
    }
}