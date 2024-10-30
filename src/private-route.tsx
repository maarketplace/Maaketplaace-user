import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [delayedRedirect, setDelayedRedirect] = useState(false);

    useEffect(() => {
        // Check token in localStorage on component mount
        const token = localStorage.getItem('user/maarketplaace');
        setLoading(false);

        // Set up delayed redirection if no token is available
        if (!token) {
            const timer = setTimeout(() => {
                setDelayedRedirect(true);
            }, 2000); // 2-second delay before redirect

            return () => clearTimeout(timer); // Clear timer on unmount
        }
    }, []);

    if (loading) return <div>Loading...</div>;
    if (delayedRedirect) return <Navigate to="/" replace />;

    return children;
};

export default ProtectedRoute;
