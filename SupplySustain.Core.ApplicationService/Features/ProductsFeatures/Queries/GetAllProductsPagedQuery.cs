using MediatR;
using SupplySustain.Core.Contracts.Facade;
using SupplySustain.Core.Domain.DTOs;
using SupplySustain.Core.Domain.Pagination;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace SupplySustain.Core.ApplicationService.Features.ProductsFeatures.Queries
{
    public class GetAllProductsPagedQuery : IRequest<IEnumerable<ProductsDTO>>
    {
        public PaginationParams PaginationParams { get; set; }
        public class GetAllProductsPagedQueryHandler : IRequestHandler<GetAllProductsPagedQuery, IEnumerable<ProductsDTO>>
        {
            private readonly IProductsFacade productsFacade;

            public GetAllProductsPagedQueryHandler(IProductsFacade productsFacade)
            {
                this.productsFacade = productsFacade;
            }
#pragma warning disable CS1998 // Async method lacks 'await' operators and will run synchronously
            public async Task<IEnumerable<ProductsDTO>> Handle(GetAllProductsPagedQuery query, CancellationToken cancellationToken)
            {
                var productList = productsFacade.GetPagedProducts(query.PaginationParams);
                if (productList == null)
                {
                    return null;
                }
                return productList;
            }
        }
    }
}
