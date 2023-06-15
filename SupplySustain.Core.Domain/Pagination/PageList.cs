using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SupplySustain.Core.Domain.Pagination
{
    public class PageList<T>
    {

        public PageList(int count, int pageNumber, int pageSize, List<T> items)
        {
            CurrentPage = pageNumber;
            PageSize = pageSize;
            TotalCount = count;
            TotalPages = (int)Math.Ceiling(TotalCount / (double)pageSize);
            PageMetaData = new PageMetaData(pageNumber, TotalPages, pageSize, TotalCount);
            Items = items;
        }
        public PageMetaData PageMetaData { get; private set; }
        public List<T> Items { get; private set; }
        public int CurrentPage { get; private set; }
        public int TotalPages { get; private set; }
        public int PageSize { get; private set; }
        public int TotalCount { get; private set; }

    }
}
