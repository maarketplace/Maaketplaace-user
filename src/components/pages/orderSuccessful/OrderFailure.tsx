import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from 'lottie-react';
import Error from '../../../../public/Error.json'
const OrderFailure = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/');
        }, 5000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="w-full h-[80vh] flex flex-col items-center justify-center">
            <Lottie
                autoplay
                loop
                animationData={Error}
                style={{ height: '300px', width: '200px' }}
            />
            <h1 className="text-2xl font-bold">Order cancelled!</h1>
            <p className="text-center">Sorry your order was cancelled</p>
        </div>
    );
};

export default OrderFailure;
