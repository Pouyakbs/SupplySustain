using AutoMapper;
using SupplySustain.Core.Domain.DTOs;
using SupplySustain.Core.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SupplySustain.Core.ApplicationService.Config
{
    public class ProductsProfile : Profile
    {
        public ProductsProfile()
        {
            CreateMap<Products, ProductsDTO>();
            CreateMap<ProductsDTO, Products>();
        }
    }
}
