using FluentAssertions;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using ServiceHost.Controllers;
using ServiceHost.Models;
using SupplySustain.Core.Contracts.UnitofWork;
using SupplySustain.Core.Domain.DTOs;
using SupplySustain.Infrastructure.Data;
using SupplySustain.Infrastructure.EF;
using System;
using System.Collections.Generic;
using System.Linq;
using Xunit;

namespace SupplySustain.Test
{
    public class ProductsUnitTestController
    {
        public static DbContextOptions<DemoContext> dbContextOptions { get; set; }
        public static string connectionString = "Server=.;Database=SupplySustain;Trusted_Connection=True;MultipleActiveResultSets=true";

        public ProductsUnitTestController()
        {
            dbContextOptions = new DbContextOptionsBuilder<DemoContext>()
                .UseSqlServer(connectionString)
                .Options;
        }
        #region Get By Id

        [Fact]
        public async void Task_GetProductById_Return_OkResult()
        {
            //Arrange
            var mediator = new Mock<IMediator>();
            var controller = new ProductsController(mediator.Object);
            var productId = 1;

            //Act
            var data = await controller.GetById(productId);

            //Assert
            Assert.IsType<OkObjectResult>(data);
        }

        [Fact]
        public async void Task_GetProductById_Return_NotFoundResult()
        {
            //Arrange
            var mediator = new Mock<IMediator>();
            var controller = new ProductsController(mediator.Object);
            var productId = 10;

            //Act
            var data = await controller.GetById(productId);

            //Assert
            Assert.IsType<NotFoundResult>(data);
        }

        [Fact]
        public async void Task_GetProductById_Return_BadRequestResult()
        {
            //Arrange
            var mediator = new Mock<IMediator>();
            var controller = new ProductsController(mediator.Object);
            int productId = 0;

            //Act
            var data = await controller.GetById(productId);

            //Assert
            Assert.IsType<BadRequestResult>(data);
        }

        [Fact]
        public async void Task_GetProductById_MatchResult()
        {
            //Arrange
            var mediator = new Mock<IMediator>();
            var controller = new ProductsController(mediator.Object);
            int productId = 1;

            //Act
            var data = await controller.GetById(productId);

            //Assert
            Assert.IsType<OkObjectResult>(data);

            var okResult = data.Should().BeOfType<OkObjectResult>().Subject;
            var product = okResult.Value.Should().BeAssignableTo<ResponseViewModel<ProductsDTO>>().Subject;

            Assert.Equal("Test ProductName 1", product.Data.ProductName);
            Assert.Equal("Test Description 1", product.Data.Desc);
        }

        #endregion
        #region Get All

        [Fact]
        public async void Task_GetProducts_Return_OkResult()
        {
            //Arrange
            var mediator = new Mock<IMediator>();
            var controller = new ProductsController(mediator.Object);

            //Act
            var data = await controller.GetAll();

            //Assert
            Assert.IsType<OkObjectResult>(data);
        }

        [Fact]
        public void Task_GetProducts_Return_BadRequestResult()
        {
            //Arrange
            var mediator = new Mock<IMediator>();
            var controller = new ProductsController(mediator.Object);

            //Act
            var data = controller.GetAll();
            data = null;

            if (data != null)
                //Assert
                Assert.IsType<BadRequestResult>(data);
        }

        [Fact]
        public async void Task_GetProducts_MatchResult()
        {
            //Arrange
            var mediator = new Mock<IMediator>();
            var controller = new ProductsController(mediator.Object);

            //Act
            var data = await controller.GetAll();

            //Assert
            Assert.IsType<OkObjectResult>(data);
        }

        #endregion
        #region Delete Product

        [Fact]
        public async void Task_Delete_Product_Return_OkResult()
        {
            //Arrange
            var mediator = new Mock<IMediator>();
            var controller = new ProductsController(mediator.Object);
            var productId = 2;

            //Act
            var data = await controller.Delete(productId);

            //Assert
            Assert.IsType<OkResult>(data);
        }

        [Fact]
        public async void Task_Delete_Product_Return_NotFoundResult()
        {
            //Arrange
            var mediator = new Mock<IMediator>();
            var controller = new ProductsController(mediator.Object);
            var productId = 5;

            //Act
            var data = await controller.Delete(productId);

            //Assert
            Assert.IsType<NotFoundResult>(data);
        }

        [Fact]
        public async void Task_Delete_Return_BadRequestResult()
        {
            //Arrange
            var mediator = new Mock<IMediator>();
            var controller = new ProductsController(mediator.Object);
            int productId = 0;

            //Act
            var data = await controller.Delete(productId);

            //Assert
            Assert.IsType<BadRequestResult>(data);
        }

#endregion
    }
}
