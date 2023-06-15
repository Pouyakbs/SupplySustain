import { apiSlice } from "../store/api-slice";

export const ProductSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createProducts: builder.mutation({
      invalidatesTags: ["Products"],
      query: (competitor) => {
        return {
          url: `/Products`,
          body: competitor,
          method: "POST",
        };
      },
      transformErrorResponse: (response, meta, arg) => response.data.errorList,
    }),
    GetAllProducts: builder.query({
      query: (obj) => {
        return {
        url: `/products/GetAllPaged`,
        params: {
            PageNumber: obj.PageNumber,
            PageSize: obj.PageSize,
        },
        method: "GET"
    }},
      transformResponse: (response, meta, arg) => [response.data , JSON.parse(meta.response.headers.get('pagination'))],
      transformErrorResponse: (response, meta, arg) => response.data.errorList,
      providesTags: (result) =>
        result
          ? result.map(({ id }) => ({ type: "Products", id }))
          : ["Products"],
    }),
    updateProduct: builder.mutation({
      invalidatesTags: ["Products"],
      query: (args) => {
        const { id, product } = args;
        return {
          url: `Products/Update/${id}`,
          body: product,
          method: "PUT",
        };
      },
      transformResponse: (response, meta, arg) => response.data,
      transformErrorResponse: (response, meta, arg) => response.data.errorList,
    }),
    getProduct: builder.query({
      query: (id) => `Products/${id}`,
      transformResponse: (response, meta, arg) => response.data,
      transformErrorResponse: (response, meta, arg) => response.data.errorList,
      providesTags: (result, error, id) => [{ type: "Products", id }],
    }),
    deleteProduct: builder.mutation({
      //Delete
      query: (id) => {
        return {
          url: `/Products/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: (result, error, arg) => {
        return [{ type: "Products", id: arg?.productID }];
      },
      transformResponse: (response, meta, arg) => response.data,
      transformErrorResponse: (response, meta, arg) => response.data.errorList,
    }),
  }),
});

export const {
  useCreateProductsMutation,
  useDeleteProductMutation,
  useGetAllProductsQuery,
  useGetProductQuery,
  useUpdateProductMutation
} = ProductSlice;
