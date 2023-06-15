using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.SecurityTokenService;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;

namespace ServiceHost.Middlewares
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;

        private readonly IHostEnvironment _env;
        private JsonSerializerOptions options;



        public ExceptionMiddleware(RequestDelegate next, IHostEnvironment env)
        {
            _next = next;
            _env = env;

        }
        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                var problemDetails = new ProblemDetails
                {
                    Title = "Internal server error",
                    Status = (int)HttpStatusCode.InternalServerError,
                    Type = "https://httpstatuses.com/500",
                    Detail = _env.IsDevelopment() ? ex.ToString() : null
                };


                switch (ex)
                {
                    case ArgumentException argEx:
                        problemDetails.Title = "Bad request";
                        problemDetails.Detail = _env.IsDevelopment() ? argEx.StackTrace?.ToString() : argEx.Message;
                        problemDetails.Status = (int)HttpStatusCode.BadRequest;
                        problemDetails.Type = "https://httpstatuses.com/400";
                        break;

                    case InvalidOperationException opEx:

                        problemDetails.Title = "Bad request";
                        problemDetails.Detail = _env.IsDevelopment() ? opEx.StackTrace?.ToString() : opEx.Message;
                        problemDetails.Status = (int)HttpStatusCode.InternalServerError;
                        problemDetails.Type = "https://httpstatuses.com/500";


                        break;

                    case UnauthorizedAccessException unauthorizedAccess:

                        problemDetails.Title = "Access Denied!";
                        problemDetails.Detail = _env.IsDevelopment() ? unauthorizedAccess.StackTrace?.ToString() : unauthorizedAccess.Message;
                        problemDetails.Status = (int)HttpStatusCode.Unauthorized;
                        problemDetails.Type = "https://httpstatuses.com/401";


                        break;

                    case BadHttpRequestException badHttpRequestEx:

                        problemDetails.Title = "Bad request";
                        problemDetails.Detail = _env.IsDevelopment() ? badHttpRequestEx.StackTrace?.ToString()
                        : badHttpRequestEx.Message;
                        problemDetails.Status = (int)HttpStatusCode.BadRequest;
                        problemDetails.Type = "https://httpstatuses.com/400";
                        break;
                    case BadRequestException badRequestEx:

                        problemDetails.Title = "Bad request";
                        problemDetails.Detail = badRequestEx.Message;
                        problemDetails.Status = (int)HttpStatusCode.BadRequest;
                        problemDetails.Type = "https://httpstatuses.com/400";
                        break;
                }
                // Set the content type to application/problem+json
                context.Response.ContentType = "application/problem+json";
                context.Response.StatusCode = (int)problemDetails.Status;
                var options = new JsonSerializerOptions();
                options.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;


                // Serialize the ProblemDetails object to JSON and write it to the response body
                var json = JsonSerializer.Serialize(problemDetails, options);
                await context.Response.WriteAsync(json);

            }
        }
    }
}
