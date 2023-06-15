import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const appConfig = window.globalConfig;
const baseQuery = fetchBaseQuery({
  baseUrl: `${appConfig.BaseURL}/api/`,
});

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQuery,
  tagTypes: [
  ],
  endpoints: () => ({}),
});
