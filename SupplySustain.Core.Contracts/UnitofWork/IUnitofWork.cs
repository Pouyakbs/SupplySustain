using SupplySustain.Core.Contracts.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SupplySustain.Core.Contracts.UnitofWork
{
    public interface IUnitOfWork : IDisposable
    {
        public IProductsRepository Products { get; }
        Task<int> Save();
    }
}
