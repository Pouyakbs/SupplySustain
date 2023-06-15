using SupplySustain.Core.Domain.Entities;
using SupplySustain.Infrastructure.EF;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SupplySustain.Test
{
    public class DataDBInitializer
    {
        public DataDBInitializer()
        {
        }

        public void Seed(DemoContext context)
        {

            context.Products.AddRange(
                new Products() { ProductName = "Phone", Desc = "" , CreatedDate = DateTime.Now , ModifiedDate = DateTime.Now },
                new Products() { ProductName = "LapTop", Desc = "", CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now },
                new Products() { ProductName = "Headset", Desc = "", CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now },
                new Products() { ProductName = "Watch", Desc = "", CreatedDate = DateTime.Now, ModifiedDate = DateTime.Now }
            );

            context.SaveChanges();
        }
    }
}
