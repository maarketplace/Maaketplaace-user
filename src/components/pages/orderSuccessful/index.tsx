import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from 'lottie-react';
import Success from '../../../../public/success.json'
const OrderSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/home/order-summary');
        }, 5000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="w-full h-[80vh] gap-2 flex flex-col items-center justify-center">
            <Lottie
                autoplay
                loop
                animationData={Success}
                style={{ height: '100px', width: '100px' }}
            />
            <h1 className="text-2xl font-bold">Order Successful!</h1>
            <p className="text-center">Thank you for your purchase. Your order has been placed successfully.</p>
        </div>
    );
};

export default OrderSuccess;
