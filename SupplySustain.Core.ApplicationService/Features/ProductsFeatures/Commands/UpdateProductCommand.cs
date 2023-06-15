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
    public class UpdateProductCommand : IRequest<int>
    {
        public int ProductID { get; set; }
        public string ProductName { get; set; }
        public string Desc { get; set; }
        public class UpdateProductCommandHandler : IRequestHandler<UpdateProductCommand, int>
        {
            private readonly IProductsFacade productsFacade;

            public UpdateProductCommandHandler(IProductsFacade productsFacade)
            {
                this.productsFacade = productsFacade;
            }
#pragma warning disable CS1998 // Async method lacks 'await' operators and will run synchronously
            public async Task<int> Handle(UpdateProductCommand command, CancellationToken cancellationToken)
            {
                var productsDTO = new ProductsDTO();
                productsDTO.ProductID = command.ProductID;
                productsDTO.ProductName = command.ProductName;
                productsDTO.Desc = command.Desc;
                productsFacade.Update(productsDTO);
                return productsDTO.ProductID;
            }
        }
    }
}
