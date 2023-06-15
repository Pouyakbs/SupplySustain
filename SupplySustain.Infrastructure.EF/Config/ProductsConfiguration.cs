using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SupplySustain.Core.Domain.Entities;

namespace SupplySustain.Infrastructure.EF.Config
{
    public class ProductsConfiguration : IEntityTypeConfiguration<Products>
    {
        public void Configure(EntityTypeBuilder<Products> builder)
        {
            builder.ToTable("Tb-Products");
            builder.HasKey(a => a.ProductID);
            builder.Property(a => a.ProductName).HasColumnType("nvarchar(128)").IsRequired(true);
            builder.Property(a => a.Desc).HasColumnType("nvarchar(max)").IsRequired(false);
            builder.Property(a => a.CreatedByUser).HasColumnType("nvarchar(64)");
            builder.Property(a => a.CreatedDate).HasColumnType("datetime").IsRequired(false);
            builder.Property(a => a.ModifiedDate).HasColumnType("datetime").IsRequired(false);
            builder.Property(a => a.ModifiedByUser).HasColumnType("nvarchar(64)");
        }
    }
}
