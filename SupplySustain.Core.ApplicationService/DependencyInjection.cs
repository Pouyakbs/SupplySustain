using AutoMapper;
using Microsoft.Extensions.DependencyInjection;
using SupplySustain.Core.ApplicationService.Extensions;
using SupplySustain.Core.Contracts.UnitofWork;
using SupplySustain.Infrastructure.Data.UnitofWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace SupplySustain.Core.ApplicationService
{
    public static class DependencyInjection
    {
        public static void AddApplicationSevice(this IServiceCollection services)
        {
            services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));
            services.AddSingleton<ContextAccessor>();
            var mapperConfig = new MapperConfiguration(mc =>
            {
                mc.AddMaps(Assembly.GetExecutingAssembly());
            });
            IMapper mapper = mapperConfig.CreateMapper();
            services.AddSingleton(mapper);
            var assembly = Assembly.GetExecutingAssembly();
            var types = assembly.GetTypes().Where(t => t.IsClass && t.Name.EndsWith("Facade")).ToList();
            foreach (var type in types)
            {
                var interfaceType = type.GetInterfaces().FirstOrDefault();
                if (interfaceType != null)
                {
                    services.AddScoped(interfaceType, type);
                }
            }
            services.AddScoped<IUnitOfWork, UnitofWork>();
        }
    }
}
