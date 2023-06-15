using Microsoft.EntityFrameworkCore;
using SupplySustain.Core.Contracts.Repository.Common;
using SupplySustain.Infrastructure.EF;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SupplySustain.Infrastructure.Data.Common
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        private DemoContext Context;
        public GenericRepository(DemoContext Context)
        {
            this.Context = Context;
        }
        public async Task Add(T entity)
        {
            await Context.Set<T>().AddAsync(entity);
            Context.Entry(entity).State = EntityState.Added;
        }

        public IQueryable<T> GetContextQuery()
        {
            return Context.Set<T>().AsQueryable();
        }
        public async Task<IEnumerable<T>> GetAll()
        {
            return await Context.Set<T>().ToListAsync();
        }

        public async Task<T> GetById(int id)
        {
            return await Context.Set<T>().FindAsync(id);
        }

        public void Remove(T entity)
        {
            Context.Set<T>().Remove(entity);
            Context.Entry(entity).State = EntityState.Deleted;
        }
        public void RemoveRange(List<T> entity)
        {
            Context.Set<T>().RemoveRange(entity);
            foreach (var item in entity)
            {
                Context.Entry(item).State = EntityState.Deleted;
            }
        }
        public void UpdateRange(List<T> entity)
        {
            Context.Set<T>().UpdateRange(entity);
            foreach (var item in entity)
            {
                Context.Entry(item).State = EntityState.Modified;
            }
        }
        public void AddRange(List<T> entity)
        {
            Context.Set<T>().AddRange(entity);
            foreach (var item in entity)
            {
                Context.Entry(item).State = EntityState.Added;
            }
        }

        public void Update(T entity)
        {
            Context.Set<T>().Update(entity);
            Context.Entry(entity).State = EntityState.Modified;
        }
    }
}
