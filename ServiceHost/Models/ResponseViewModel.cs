using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ServiceHost.Models
{
    public class ResponseViewModel<T>
    {
        public int StatusCode { get; set; }
        public T Data { get; set; }
        public ResponseViewModel()
        {
            Time = DateTime.Now;
            IsSuccess = true;
        }
        public DateTime Time { get; private set; }
        public List<string> ErrorList { get; private set; } = new List<string>();

        public bool IsSuccess { get; set; }

        public void AddError(string message)
        {
            IsSuccess = false;
            ErrorList.Add(message);
        }
    }
}
