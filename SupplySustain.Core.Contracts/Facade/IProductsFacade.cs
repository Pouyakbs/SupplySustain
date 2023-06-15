using SupplySustain.Core.Domain.DTOs;
using SupplySustain.Core.Domain.Pagination;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SupplySustain.Core.Contracts.Facade
{
    public interface IProductsFacade
    {
        Task<ProductsDTO> GetById(int id);
        IEnumerable<ProductsDTO> GetPagedProducts(PaginationParams pagination);
        Task<IEnumerable<ProductsDTO>> GetAll();
        Task<int> Add(ProductsDTO entity);
        void Remove(ProductsDTO entity);
        void Update(ProductsDTO entity);
    }
}
