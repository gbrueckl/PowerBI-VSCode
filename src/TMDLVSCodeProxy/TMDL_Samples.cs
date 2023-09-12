using Microsoft.AnalysisServices;
using TOM = Microsoft.AnalysisServices.Tabular;
using Microsoft.AnalysisServices.Tabular.Tmdl;
using System.Linq;
using Microsoft.AnalysisServices.Tabular;
using System.Text;
using Microsoft.AnalysisServices.Tabular.Serialization;
using Microsoft.AnalysisServices.Core;
using System.Reflection;


namespace TMDLVSCodeProxy
{
    internal class Program
    {
        static string outputPath = "C:\\@Repos\\Local\\TMDL-Samples\\TMDL-Samples";

        static void Main(string[] args)
        {
            try
            {
                //Stream_Deserialize();

                //Test_Deserialize();
                //Sample_Serialize();
                // Sample_Deploy();
                //Sample_CopyColumnFromAnother();
                //Sample_FromTMDLToTMSL();
                //Sample_CopyColumnFromAnother();

                Sample_ObjectSerialize();


                Console.WriteLine("Done");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());

            }

        }

        private static void TestTOM()
        {
            //var column = new TOM.DataColumn();
            //column.Name = "MyName";
            //column.SourceColumn = "xxx";

            //var json = TOM.JsonSerializer.SerializeObject(column);

            var column = new TOM.CalculatedColumn();
            column.Expression = "LEFT ( Terms[Year], 4 ) * 3 + Terms[Term Number]";

            var json = TOM.JsonSerializer.SerializeObject(column);
        }

        private static void Sample_ObjectSerialize()
        {
            var tmdlPath = $"{outputPath}\\sales_tmdl";

            var modelA = GetModelFromTMDL(tmdlPath).Model;

            var columnSerializationQualified = TOM.TmdlSerializer.SerializeObject(modelA.Tables["Product"].Columns["Product"], true);

            var columnSerializationNonQualified = TOM.TmdlSerializer.SerializeObject(modelA.Tables["Product"].Columns["Product"], false);

        }
        private static void Sample_CopyColumnFromAnother()
        {
            var tmdlPath = $"{outputPath}\\sales_tmdl";

            var bimPath = $"{outputPath}\\Sales.bim";

            var modelA = GetDatabaseFromBIM(bimPath).Model;

            var modelB = GetModelFromTMDL(tmdlPath);

            var columnFromTmdlSnippet = (TOM.CalculatedColumn)modelA.Tables["Calendar"].Columns["Date (Month)"];

            columnFromTmdlSnippet.Expression = "DATE(2020,1,1)";

            columnFromTmdlSnippet.CopyTo(modelB.Tables[columnFromTmdlSnippet.Table.Name].Columns[columnFromTmdlSnippet.Name]);

            var tmdlFolderPath = $"{Path.GetDirectoryName(bimPath)}\\modelB";

            TOM.TmdlSerializer.SerializeModelToFolder(modelB, tmdlFolderPath);
        }

        private static void Sample_SerializeFromFile()
        {

            var bimPath = $"{outputPath}\\Sales.bim";

            var model = GetDatabaseFromBIM(bimPath);

            var tmdlFolderPath = $"{Path.GetDirectoryName(bimPath)}\\sales_tmdl";

            TOM.TmdlSerializer.SerializeModelToFolder(model.Model, tmdlFolderPath);
        }

        private static void Sample_FromTMDLToTMSL()
        {
            var tmdlPath = "C:\\@Repos\\Local\\TMDL-Samples\\TMDL-Samples\\sales_tmdl";

            var model = GetModelFromTMDL(tmdlPath);

            var bimPath = "C:\\@Repos\\Local\\TMDL-Samples\\TMDL-Samples\\Sales-fromTMDL.bim";

            var options = new TOM.SerializeOptions();
            options.SplitMultilineStrings = true;
            options.IncludeRestrictedInformation = true;
            options.IgnoreInferredProperties = false;
            options.IgnoreTimestamps = false;
            var tmslText = TOM.JsonSerializer.SerializeDatabase((TOM.Database)model.Database, options);

            File.WriteAllText(bimPath, tmslText);


        }


        private static void Stream_DeserializeAndSerialize()
        {
            var tmdlPath = $"{outputPath}\\tmdl-clean";

            var context = MetadataSerializationContext.Create(MetadataSerializationStyle.Tmdl);

            var files = Directory.GetFiles(tmdlPath, "*.tmd", SearchOption.AllDirectories);

            foreach (var file in files)
            {
                using (TextReader reader = File.OpenText(file))
                {
                    //e.g. ./tables/About.tmd
                    var relativePath = file.Replace(tmdlPath, ".").Replace("\\", "/");
                    context.ReadFromDocument(relativePath, reader);
                }
            }

            var model = context.ToModel();

            // Stream Serialization

            StringBuilder output = new StringBuilder();

            foreach (MetadataDocument document in model.ToTmdl())
            {
                if (string.Compare(document.LogicalPath, "./tables/About", true) == 0)
                {
                    Console.WriteLine("About Table");
                }

                using (TextWriter writer = new StringWriter(output))
                {
                    document.WriteTo(writer);
                }
            }

            var singleTmdlFile = $"{outputPath}\\singlefile\\full.tmd";

            File.WriteAllText(singleTmdlFile, output.ToString());

            var modelFromSingleFile = TOM.TmdlSerializer.DeserializeModelFromFolder(Path.GetDirectoryName(singleTmdlFile));


        }
        private static void Sample_Deploy()
        {
            var xmlaServer = "powerbi://api.powerbi.com/v1.0/myorg/TMDL%20Test";

            var tmdlFolderPath = $"{System.Environment.CurrentDirectory}\\Contoso-tmdl";

            var model = TOM.TmdlSerializer.DeserializeModelFromFolder(tmdlFolderPath);

            using (var server = new TOM.Server())
            {
                server.Connect(xmlaServer);

                using (var remoteDatabase = server.Databases[model.Database.ID])
                {
                    model.CopyTo(remoteDatabase.Model);

                    remoteDatabase.Model.SaveChanges();
                }


                Console.WriteLine("Database deployed");
            }
        }

        private static void Sample_ForHackathon()
        {
            // I'm using a BIM file, but for Hackathon you should already have a model
            var bimPath = $"{outputPath}\\Sales.bim";

            var modelFromLocalAS = GetDatabaseFromBIM(bimPath).Model;

            var selectedTable = "Product";

            var tableTMDLText = TOM.TmdlSerializer.SerializeObject(modelFromLocalAS.Tables[selectedTable], qualifyObject: true);

            tableTMDLText += @"

column NewColumn
    sourceColumn: NewColumn
    dataType: String
    isDataTypeInferred: false
    summarizeBy: None
    lineageTag: 0f4b99cc-fdb6-4f04-b7d9-bbdc34b2c601";

            // We dont yet expose a DeserializeObject, you can do this as alternative

            var context = MetadataSerializationContext.Create(MetadataSerializationStyle.Tmdl);

            using (var reader = new StringReader(tableTMDLText))
            {
                context.ReadFromDocument("./tables/product.tmd", reader);
            }

            var modelFromTMDL = context.ToModel();

            // Copy the table to the Local AS Model

            modelFromTMDL.Tables[selectedTable].CopyTo(modelFromLocalAS.Tables[selectedTable]);

            // Write new column to confirm its on the localAS Model
            Console.WriteLine(modelFromLocalAS.Tables[selectedTable].Columns["NewColumn"].Name);
        }

        private static void Sample_Deploy2()
        {
            var xmlaServer = "powerbi://api.powerbi.com/v1.0/myorg/Demo%20-%20TMDL%20API";

            var tmdlFolderPath = $"{System.Environment.CurrentDirectory}\\Contoso-tmdl";

            var model = TOM.TmdlSerializer.DeserializeModelFromFolder(tmdlFolderPath);

            model.Database.Name = "Contoso";


            var tmslScript = TOM.JsonScripter.ScriptCreateOrReplace(model.Database, false);

            File.WriteAllText($"{System.Environment.CurrentDirectory}\\deploy.xmla", tmslScript);

            using (var server = new TOM.Server())
            {
                server.Connect(xmlaServer);

                var result = server.Execute(tmslScript);

                if (result.ContainsErrors)
                {
                    var messages = string.Join(Environment.NewLine, result.Cast<XmlaResult>().SelectMany(s => s.Messages.Cast<XmlaMessage>().Select(s2 => s2.Description)));

                    throw new Exception($"Error deploying database '{messages}'");
                }

                Console.WriteLine("Database deployed");
            }
        }

        private static void Sample_Serialize()
        {
            var xmlaServer = "powerbi://api.powerbi.com/v1.0/myorg/Demo%20-%20TMDL%20API";
            var datasetName = "Contoso";
            var outputPath = System.Environment.CurrentDirectory;

            using (var server = new TOM.Server())
            {
                server.Connect(xmlaServer);

                var database = server.Databases.GetByName(datasetName);

                var destinationFolder = $"{outputPath}\\{database.Name}-tmdl";

                TOM.TmdlSerializer.SerializeModelToFolder(database.Model, destinationFolder);

                Console.WriteLine("TMDL Folder created");
            }
        }

        //private static void Sample_SerializeStreams()
        //{
        //    var bimPath = "..\\..\\..\\Sales.bim";

        //    var database = GetDatabaseFromBIM(bimPath);

        //    StringBuilder output = new StringBuilder();

        //    foreach (MetadataDocument document in model.ToTmdl())
        //    {
        //        if (string.Compare(document.LogicalPath, "./perspectives/Perspective 1", true) == 0)
        //        {
        //            using (TextWriter writer = new StringWriter(output))
        //            {
        //                document.WriteTo(writer);
        //            }
        //        }
        //    }
        //}

        private static void Sample_SerializeFromDisk()
        {
            var bimPath = "..\\..\\..\\Sales.bim";

            var database = GetDatabaseFromBIM(bimPath);

            var destinationFolder = $"{Path.GetDirectoryName(bimPath)}\\{Path.GetFileNameWithoutExtension(bimPath)}-tmdl";

            TOM.TmdlSerializer.SerializeModelToFolder(database.Model, destinationFolder);
        }

        private static TOM.Database GetDatabaseFromBIM(string bimPath)
        {
            var compatibilityMode = CompatibilityMode.PowerBI;

            var bimContent = File.ReadAllText(bimPath);

            return TOM.JsonSerializer.DeserializeDatabase(bimContent, null, compatibilityMode);
        }

        private static TOM.Model GetModelFromTMDL(string path)
        {

            return TOM.TmdlSerializer.DeserializeModelFromFolder(path);
        }

        private static void Test_Deserialize()
        {

            var tmdlPath = "C:\\@Repos\\Local\\TMDL-Samples\\TMDL-Samples\\tmdl-clean\\";

            var model = TOM.TmdlSerializer.DeserializeModelFromFolder(tmdlPath);

        }

        private static void Test_Deserialize_TMDLException()
        {
            try
            {
                var tmdlPath = "C:\\@Repos\\Local\\TMDL-Samples\\TMDL-Samples\\tmdl2";

                var model = TOM.TmdlSerializer.DeserializeModelFromFolder(tmdlPath);


                model.Name = "XPto";
                model.Database.ID = "XPtoId";


            }
            catch (TmdlFormatException ex)
            {
                var errorMsg = ex.Message;
                var path = ex.Path;
                var line = ex.LineNumber;
                var lineText = ex.LineText;

                Console.WriteLine($"Error on Deserializing TMDL '{errorMsg}', path: '{path}'  line: '{line}', line text: '{lineText}'");
                throw;
            }

        }
    }
}
