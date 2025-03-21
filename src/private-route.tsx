import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

import { ReactNode } from 'react';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const [loading, setLoading] = useState(true);
    const [delayedRedirect, setDelayedRedirect] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('user/marketplace');
        setLoading(false);
        if (!token) {
            const timer = setTimeout(() => {
                setDelayedRedirect(true);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, []);

    if (loading) return <div>Loading...</div>;
    if (delayedRedirect) return <Navigate to="/" replace />;

    return children;
};

export default ProtectedRoute;
