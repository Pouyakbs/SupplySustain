using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SupplySustain.Core.Domain.DTOs
{
    public class ProductsDTO
    {
        public int ProductID { get; set; }
        public string ProductName { get; set; }
        public string Desc { get; set; }
        public DateTime? CreatedDate { get; set; }
    }
}
