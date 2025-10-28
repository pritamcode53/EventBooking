using System.Data;
using Npgsql;
using backend.DAL;
using backend.Helpers;
using backend.Services;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// ---------------------- Add Services ----------------------

// Controllers
builder.Services.AddControllers();

// ---------------------- CORS ----------------------
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactCorsPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// ---------------------- PostgreSQL Dapper Connection ----------------------
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")!;
builder.Services.AddScoped<IDbConnection>(sp => new NpgsqlConnection(connectionString));

// ---------------------- DAL & Helper DI ----------------------
// User
builder.Services.AddScoped<UserDAL>();
builder.Services.AddScoped<UserHelper>(sp =>
{
    var userDAL = sp.GetRequiredService<UserDAL>();
    var jwtService = sp.GetRequiredService<JwtService>();
    return new UserHelper(userDAL, jwtService);
});

// Venue
builder.Services.AddScoped<VenueDAL>();
builder.Services.AddScoped<VenueHelper>(sp =>
{
    var venueDAL = sp.GetRequiredService<VenueDAL>();
    var env = sp.GetRequiredService<IWebHostEnvironment>();
    return new VenueHelper(venueDAL, env);
});

// Booking
builder.Services.AddScoped<BookingDAL>();
builder.Services.AddScoped<BookingHelper>(sp =>
{
    var bookingDAL = sp.GetRequiredService<BookingDAL>();
    var venueDAL = sp.GetRequiredService<VenueDAL>();
    var paymentDAL = sp.GetRequiredService<PaymentDAL>();
    var mailService = sp.GetRequiredService<MailService>(); // inject MailService
    var userDAL = sp.GetRequiredService<UserDAL>();         // inject UserDAL for fetching owner/customer info
    return new BookingHelper(bookingDAL, venueDAL, mailService, userDAL, paymentDAL);
});
// Review
builder.Services.AddScoped<ReviewDAL>();
builder.Services.AddScoped<ReviewHelper>(sp =>
{
    var reviewDAL = sp.GetRequiredService<ReviewDAL>();
    var venueDAL = sp.GetRequiredService<VenueDAL>();
    var env = sp.GetRequiredService<IWebHostEnvironment>();
    return new ReviewHelper(reviewDAL, venueDAL, env);
});
// Home (for homepage venue listing)
builder.Services.AddScoped<HomeDAL>();
builder.Services.AddScoped<HomeHelper>();
// Paymet 
builder.Services.AddScoped<PaymentDAL>();
// Register PaymentHelper
builder.Services.AddScoped<PaymentHelper>(sp =>
{
    var paymentDAL = sp.GetRequiredService<PaymentDAL>();
    return new PaymentHelper(paymentDAL);
});
//Admin
builder.Services.AddScoped<AdminDAL>();
builder.Services.AddScoped<AdminHelper>(sp =>
{
    var adminDAL = sp.GetRequiredService<AdminDAL>();
    return new AdminHelper(adminDAL);
});
// Refund
builder.Services.AddScoped<RefundDAL>();
builder.Services.AddScoped<RefundHelper>(sp =>
{
    var refundDAL = sp.GetRequiredService<RefundDAL>();
    return new RefundHelper(refundDAL);
});


// ---------------------- JWT Service ----------------------
builder.Services.AddSingleton<JwtService>();
// ----------------------------- Mail Service ------------------
builder.Services.AddSingleton<MailService>();


// ---------------------- Initialize Database ----------------------
var dbInitializer = new DbInitializer(connectionString);
dbInitializer.Initialize();

// ---------------------- JWT Authentication ----------------------
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"] ?? throw new ArgumentNullException("JwtSettings:SecretKey missing");
var key = Encoding.ASCII.GetBytes(secretKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var token = context.Request.Cookies["jwtToken"];
            if (!string.IsNullOrEmpty(token))
                context.Token = token;
            return Task.CompletedTask;
        }
    };
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };
});

// ---------------------- JSON Options ----------------------
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
    });

// ---------------------- Swagger ----------------------
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// ---------------------- Middleware ----------------------
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("ReactCorsPolicy");
app.UseAuthentication();
app.UseAuthorization();
app.UseStaticFiles();
app.MapControllers();

// ---------------------- Run App ----------------------
app.Run();
