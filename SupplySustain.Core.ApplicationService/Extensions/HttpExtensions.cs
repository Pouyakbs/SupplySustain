using SupplySustain.Core.Domain.Pagination;
using System.Linq;
using System.Threading.Tasks;

namespace SupplySustain.Core.ApplicationService.Extensions
{
    public static class HttpExtensions
    {
        public static PageList<T> ToPagedList<T>(this IQueryable<T> source, PaginationParams parameters)
        {
            var totalCount = source.Count();
            int skip = (parameters.PageNumber - 1) * parameters.PageSize;
            var items = source.Skip(skip).Take(parameters.PageSize).ToList();
            var pageList = new PageList<T>(totalCount, parameters.PageNumber, parameters.PageSize, items);
            return pageList;
        }

    }
}
