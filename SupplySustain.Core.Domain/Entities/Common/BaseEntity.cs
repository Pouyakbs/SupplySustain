using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SupplySustain.Core.Domain.Entities.Common
{
    public abstract class BaseEntity<T>
    {
        public BaseEntity()
        {
            ModifiedDate = DateTime.Now;
        }
        public DateTime? CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public string CreatedByUser { get; set; }
        public string ModifiedByUser { get; set; }
    }
}
