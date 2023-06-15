using Microsoft.AspNetCore.Http;
using SupplySustain.Core.Domain.Pagination;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json;

namespace SupplySustain.Core.ApplicationService.Extensions
{
    public class ContextAccessor
    {
        private readonly IHttpContextAccessor httpContext;

        public ContextAccessor(IHttpContextAccessor httpContext)
        {
            this.httpContext = httpContext;
        }
        public void AddPaginationHeader(PageMetaData metaData)
        {
            var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

            httpContext.HttpContext.Response.Headers.Add("Pagination", JsonSerializer.Serialize(metaData, options));
            httpContext.HttpContext.Response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
        }
    }
}
