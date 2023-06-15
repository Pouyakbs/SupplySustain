import { lazy } from 'react';

// project import
import Loadable from '../components/Loadable';
import MainLayout from '../layout/MainLayout';

// render - dashboard
const ProductManagement = Loadable(lazy(() => import('../pages/Products/ProductManagement')));
const NewProduct = Loadable(lazy(() => import('../pages/Products/NewProduct')));

// ==============================|| MAIN ROUTING ||============================== //


const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '/',
            element: (<ProductManagement />)
        },
        {
            path: '/NewProduct',
            element: (<NewProduct />)
        },
    ]
};

export default MainRoutes;
