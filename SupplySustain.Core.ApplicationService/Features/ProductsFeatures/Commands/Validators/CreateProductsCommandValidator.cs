using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SupplySustain.Core.ApplicationService.Features.ProductsFeatures.Commands.Validators
{
    public class CreateProductsCommandValidator : AbstractValidator<CreateProductsCommand>
    {
        public CreateProductsCommandValidator()
        {
            RuleFor(x => x.ProductName).MaximumLength(128).WithMessage("نام محصول تا 128 کاراکتر مجاز است");
        }

    }
}
