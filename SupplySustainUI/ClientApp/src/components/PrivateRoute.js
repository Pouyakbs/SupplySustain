import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { history } from '../utils/history';
import { useEffect } from 'react';

export { PrivateRoute };

function PrivateRoute({ children }) {
        // not logged in so redirect to login page with the return url
        return <Navigate to="/login" state={{ from: history.location }} />

    // authorized so return child components
    return children;
}