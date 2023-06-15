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
    public class GetProductByIDQuery : IRequest<ProductsDTO>
    {
        public int Id { get; set; }
        public class GetProductByIDQueryHandler : IRequestHandler<GetProductByIDQuery, ProductsDTO>
        {
            private readonly IProductsFacade productsFacade;

            public GetProductByIDQueryHandler(IProductsFacade productsFacade)
            {
                this.productsFacade = productsFacade;
            }
            public async Task<ProductsDTO> Handle(GetProductByIDQuery query, CancellationToken cancellationToken)
            {
                var account = await productsFacade.GetById(query.Id);
                if (account == null) return null;
                return account;
            }
        }
    }
}
