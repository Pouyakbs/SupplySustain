using Microsoft.EntityFrameworkCore;
using System;
using System.Reflection;
using SupplySustain.Core.Domain.Entities;

namespace SupplySustain.Infrastructure.EF
{
    public class DemoContext : DbContext
    {
        public DemoContext(DbContextOptions<DemoContext> dbContextOptions) : base(dbContextOptions)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        }
        public DbSet<Products> Products { get; set; }
    }
}
