using Microsoft.AnalysisServices;
using Microsoft.AspNetCore.Builder;
using TOM = Microsoft.AnalysisServices.Tabular;

using TMDLVSCodeConsoleProxy.Controllers;
using TMDLVSCodeConsoleProxy;

// See https://aka.ms/new-console-template for more information
Console.WriteLine("TMDL VSCode Console Proxy starting ...");
var server = ServerManager.GetServer("Data Source=powerbi://api.powerbi.com/v1.0/myorg/PPU");
Console.Write(server.ConnectionInfo.ToString());
Console.WriteLine("Finished!");
var builder = WebApplication.CreateBuilder();

var secret = args[0];

TMDLProxyController.SetSecret(secret);
//TMDLProxyController.SetAccessToken(accessToken);
//TMDLProxyController.SetServer(server);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        policy =>
        {
            policy.AllowAnyHeader().AllowAnyOrigin().AllowAnyMethod();
        });
});

//builder.WebHost.UseUrls(hostingUrl);
builder.WebHost.UseUrls("http://127.0.0.1:0");

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection(); // we want to use HTTP
app.UseRouting();

app.UseCors();

//app.UseAuthorization();

app.MapControllers();

app.Run();
