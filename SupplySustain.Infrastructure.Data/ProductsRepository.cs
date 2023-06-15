using SupplySustain.Core.Contracts.Repository;
using SupplySustain.Core.Domain.Entities;
using SupplySustain.Infrastructure.Data.Common;
using SupplySustain.Infrastructure.EF;
using System;

namespace SupplySustain.Infrastructure.Data
{
    public class ProductsRepository : GenericRepository<Products>, IProductsRepository
    {
        public ProductsRepository(DemoContext Context) : base(Context)
        {
        }
    }
}
