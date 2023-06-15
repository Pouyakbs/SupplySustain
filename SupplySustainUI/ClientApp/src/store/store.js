// third-party
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './api-slice';
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import storage from 'redux-persist/lib/storage'
// project import
// ==============================|| REDUX TOOLKIT - MAIN STORE ||============================== //

export const store = configureStore({
  reducer: {
      [apiSlice.reducerPath]: apiSlice.reducer
  },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware().concat(apiSlice.middleware),
        devTools: true
    
});
setupListeners(store.dispatch);
export default store