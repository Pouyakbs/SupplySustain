using MediatR;
using SupplySustain.Core.Contracts.Facade;
using SupplySustain.Core.Domain.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace SupplySustain.Core.ApplicationService.Features.ProductsFeatures.Commands
{
    public class CreateProductsCommand : IRequest<int>
    {
        public string ProductName { get; set; }
        public string Desc { get; set; }
        public class CreateProductsCommandHandler : IRequestHandler<CreateProductsCommand, int>
        {
            private readonly IProductsFacade productsFacade;

            public CreateProductsCommandHandler(IProductsFacade productsFacade)
            {
                this.productsFacade = productsFacade;
            }
            public async Task<int> Handle(CreateProductsCommand command, CancellationToken cancellationToken)
            {
                var productsDTO = new ProductsDTO();
                productsDTO.ProductName = command.ProductName;
                productsDTO.Desc = command.Desc;
                productsDTO.CreatedDate = DateTime.Now;
                await productsFacade.Add(productsDTO);
                return productsDTO.ProductID;
            }
        }
    }
}
