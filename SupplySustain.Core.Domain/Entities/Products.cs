using SupplySustain.Core.Domain.Entities.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SupplySustain.Core.Domain.Entities
{
    public class Products : BaseEntity<int>
    {
        public int ProductID { get; set; }
        public string ProductName { get; set; }
        public string Desc { get; set; }
    }
}
