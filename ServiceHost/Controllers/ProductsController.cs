using FluentValidation.Results;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using ServiceHost.Models;
using SupplySustain.Core.ApplicationService.Features.ProductsFeatures.Commands;
using SupplySustain.Core.ApplicationService.Features.ProductsFeatures.Commands.Validators;
using SupplySustain.Core.ApplicationService.Features.ProductsFeatures.Queries;
using SupplySustain.Core.Contracts.UnitofWork;
using SupplySustain.Core.Domain.DTOs;
using SupplySustain.Core.Domain.Pagination;
using SupplySustain.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ServiceHost.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IMediator mediator;

        public ProductsController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateProductsCommand command)
        {
            ResponseViewModel<int> model = new ResponseViewModel<int>();
            try
            {
                var validator = new CreateProductsCommandValidator();
                ValidationResult validationResult = await validator.ValidateAsync(command);
                if (!validationResult.IsValid)
                {

                    validationResult.Errors.ForEach(x => model.AddError(x.ErrorMessage));
                    return BadRequest(model);
                }
                model.Data = await mediator.Send(command);
            }
            catch (Exception ex)
            {
                model.AddError(ex.Message);
                return BadRequest(model);
            }

            return Created($"/api/products/{model.Data}", model);
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            ResponseViewModel<IEnumerable<ProductsDTO>> model = new ResponseViewModel<IEnumerable<ProductsDTO>>();
            try
            {
                model.Data = await mediator.Send(new GetAllProductsQuery());
            }
            catch (Exception ex)
            {

                model.AddError(ex.Message);
                return BadRequest(model);
            }
            return Ok(model);
        }
        [HttpGet("GetAllPaged")]
        public async Task<IActionResult> GetAllPaged([FromQuery] PaginationParams param)
        {
            ResponseViewModel<IEnumerable<ProductsDTO>> model = new ResponseViewModel<IEnumerable<ProductsDTO>>();
            try
            {
                model.Data = await mediator.Send(new GetAllProductsPagedQuery() { PaginationParams = param });
            }
            catch (Exception ex)
            {

                model.AddError(ex.Message);
                return BadRequest(model);
            }
            return Ok(model);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            ResponseViewModel<ProductsDTO> model = new ResponseViewModel<ProductsDTO>();
            try
            {
                model.Data = await mediator.Send(new GetProductByIDQuery { Id = id });
            }
            catch (InvalidOperationException)
            {
                model.AddError("رقیب وجود ندارد");
                return NotFound(model);
            }
            return Ok(model);
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var products = await mediator.Send(new GetProductByIDQuery { Id = id });
            await mediator.Send(new DeleteProductByIDCommand { Id = id });
            return Ok($"/api/products/Delete/{products}");
        }
        [HttpPut("[action]/{id}")]
        public async Task<IActionResult> Update(int id, UpdateProductCommand command)
        {
            ResponseViewModel<int> model = new ResponseViewModel<int>();
            var validator = new UpdateProductsCommandValidator();
            ValidationResult validationResult = await validator.ValidateAsync(command);
            if (!validationResult.IsValid)
            {

                validationResult.Errors.ForEach(x => model.AddError(x.ErrorMessage));
                return BadRequest(model);
            }

            command.ProductID = id;
            if (command.ProductID == 0)
            {
                return BadRequest("ID Not Found");
            }
            await mediator.Send(command);
            return Ok(command);
        }
    }
}
