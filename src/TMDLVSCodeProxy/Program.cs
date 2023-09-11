using TMDLVSCodeProxy.Controllers;

var builder = WebApplication.CreateBuilder(args);

var hostingUrl = args[0];
var secret = args[1];

TMDLProxyController.SetSecret(secret);

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

builder.WebHost.UseUrls(hostingUrl);

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
