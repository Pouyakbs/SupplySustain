using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SupplySustain.Core.Contracts.Repository.Common
{
    public interface IGenericRepository<T> where T : class
    {
        Task<T> GetById(int id);
        Task<IEnumerable<T>> GetAll();
        Task Add(T entity);
        void Remove(T entity);
        IQueryable<T> GetContextQuery();
        void RemoveRange(List<T> entity);
        void UpdateRange(List<T> entity);
        void AddRange(List<T> entity);
        void Update(T entity);
    }
}
