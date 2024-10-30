
import { Navigate } from 'react-router-dom';
import { useAuth } from './context/Auth';

const ProtectedRoute = ({ children }) => {
    const { isUserAuthenticated, loading } = useAuth();

    if (loading) return <div>Loading...</div>;
    if (!isUserAuthenticated) return <Navigate to="/login" replace />;

    return children;
};

export default ProtectedRoute;
