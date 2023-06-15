// third-party
import { configureStore } from '@reduxjs/toolkit';


// project import
import reducers from './reducers';

// ==============================|| REDUX TOOLKIT - MAIN STORE ||============================== //

const store = configureStore({
    reducer: {
    } 
});

const { dispatch } = store;

export { store, dispatch };
