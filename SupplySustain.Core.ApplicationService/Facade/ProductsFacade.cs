using AutoMapper;
using SupplySustain.Core.ApplicationService.Extensions;
using SupplySustain.Core.Contracts.Facade;
using SupplySustain.Core.Contracts.UnitofWork;
using SupplySustain.Core.Domain.DTOs;
using SupplySustain.Core.Domain.Entities;
using SupplySustain.Core.Domain.Pagination;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SupplySustain.Core.ApplicationService.Facade
{
    public class ProductsFacade : IProductsFacade
    {
        private readonly IUnitOfWork unitofWork;
        private readonly IMapper mapper;
        private readonly ContextAccessor httpContext;

        public ProductsFacade(IUnitOfWork unitofWork, IMapper mapper, ContextAccessor httpContext)
        {
            this.unitofWork = unitofWork;
            this.mapper = mapper;
            this.httpContext = httpContext;
        }
        public async Task<int> Add(ProductsDTO entity)
        {
            Products productsDTO = mapper.Map<ProductsDTO, Products>(entity);
            await unitofWork.Products.Add(productsDTO);
            await unitofWork.Save();
            return productsDTO.ProductID;
        }

        public IEnumerable<ProductsDTO> GetPagedProducts(PaginationParams pagination)
        {
            var query = unitofWork.Products.GetContextQuery();
            var pageList = query.ToPagedList(pagination);
            httpContext.AddPaginationHeader(pageList.PageMetaData);
            return mapper.Map<IEnumerable<ProductsDTO>>(pageList.Items);
        }
        public async Task<IEnumerable<ProductsDTO>> GetAll()
        {
            IEnumerable<Products> products = await unitofWork.Products.GetAll();
            IEnumerable<ProductsDTO> productsDTO = mapper.Map<IEnumerable<Products>, IEnumerable<ProductsDTO>>(products);
            return productsDTO;
        }

        public async Task<ProductsDTO> GetById(int id)
        {
            Products products = await unitofWork.Products.GetById(id);
            ProductsDTO productsDTO = mapper.Map<Products, ProductsDTO>(products);
            return productsDTO;
        }

        public void Remove(ProductsDTO entity)
        {
            Products products = mapper.Map<ProductsDTO, Products>(entity);
            unitofWork.Products.Remove(products);
            unitofWork.Save();
        }

        public void Update(ProductsDTO entity)
        {
            Products products = mapper.Map<ProductsDTO, Products>(entity);
            Products productsDTO = unitofWork.Products.GetById(products.ProductID).GetAwaiter().GetResult();
            productsDTO.CreatedDate = products.CreatedDate;
            unitofWork.Products.Update(products);
            unitofWork.Save();
        }
    }
}
