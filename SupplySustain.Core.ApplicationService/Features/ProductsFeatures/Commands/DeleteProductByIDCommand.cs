using MediatR;
using SupplySustain.Core.Contracts.Facade;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace SupplySustain.Core.ApplicationService.Features.ProductsFeatures.Commands
{
    public class DeleteProductByIDCommand : IRequest<int>
    {
        public int Id { get; set; }
        public class DeleteProductByIDCommandHandler : IRequestHandler<DeleteProductByIDCommand, int>
        {
            private readonly IProductsFacade productsFacade;

            public DeleteProductByIDCommandHandler(IProductsFacade productsFacade)
            {
                this.productsFacade = productsFacade;
            }
            public async Task<int> Handle(DeleteProductByIDCommand command, CancellationToken cancellationToken)
            {
                var product = await productsFacade.GetById(command.Id);
                productsFacade.Remove(product);
                return command.Id;
            }
        }
    }
}
