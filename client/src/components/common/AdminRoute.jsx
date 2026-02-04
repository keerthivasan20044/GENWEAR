import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    if (!isAuthenticated || user?.role !== 'admin') {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default AdminRoute;
