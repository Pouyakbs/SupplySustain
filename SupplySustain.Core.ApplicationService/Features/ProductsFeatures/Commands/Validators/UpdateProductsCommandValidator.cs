using FluentValidation;

namespace SupplySustain.Core.ApplicationService.Features.ProductsFeatures.Commands.Validators
{
    public class UpdateProductsCommandValidator : AbstractValidator<UpdateProductCommand>
    {
        public UpdateProductsCommandValidator()
        {
            RuleFor(x => x.ProductID).NotNull();
            RuleFor(x => x.ProductName).NotNull().MaximumLength(128).WithMessage("نام محصول تا 128 کاراکتر مجاز است");
        }

    }
}
