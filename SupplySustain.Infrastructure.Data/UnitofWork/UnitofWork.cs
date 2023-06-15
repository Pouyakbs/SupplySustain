using SupplySustain.Core.Contracts.Repository;
using SupplySustain.Core.Contracts.UnitofWork;
using SupplySustain.Infrastructure.EF;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SupplySustain.Infrastructure.Data.UnitofWork
{
    public class UnitofWork : IUnitOfWork
    {
        private DemoContext context;

        public UnitofWork(DemoContext context)
        {
            this.context = context;
            Products = new ProductsRepository(this.context);
        }
        public IProductsRepository Products { get; private set; }

        public void Dispose()
        {
            context.Dispose();
        }
        public async Task<int> Save()
        {
            return await context.SaveChangesAsync();
        }
    }
}
