using MediatR;
using SupplySustain.Core.Contracts.Facade;
using SupplySustain.Core.Domain.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace SupplySustain.Core.ApplicationService.Features.ProductsFeatures.Queries
{
    public class GetAllProductsQuery : IRequest<IEnumerable<ProductsDTO>>
    {
        public class GetAllProductsQueryHandler : IRequestHandler<GetAllProductsQuery, IEnumerable<ProductsDTO>>
        {
            private readonly IProductsFacade productsFacade;

            public GetAllProductsQueryHandler(IProductsFacade productsFacade)
            {
                this.productsFacade = productsFacade;
            }
            public async Task<IEnumerable<ProductsDTO>> Handle(GetAllProductsQuery query, CancellationToken cancellationToken)
            {
                var productList = await productsFacade.GetAll();
                if (productList == null)
                {
                    return null;
                }
                return productList;
            }
        }
    }
}
