import Lottie from 'lottie-react';
import Success from '../../../../public/success.json'
import { useNavigate } from 'react-router-dom';

const FreeOrderSuccess = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/home')
        localStorage.removeItem('orderRefrence')
    }
    return (
        <div className="w-full h-[80vh] gap-2 flex flex-col items-center justify-center">
            <Lottie
                autoplay
                loop
                animationData={Success}
                style={{ height: '100px', width: '100px' }}
            />
            <h1 className="text-2xl font-bold">Order Successful!</h1>
            <p className="text-center text-[14px]">Thank you for your purchase. Your order has been placed successfully.</p>
            <p className="text-center text-[12px]">Check your dashboard to download the product</p>
            <span className="w-[30%] flex items-center justify-center max-[650px]:w-[100%]">
                <button className="w-[90%] h-[40px] bg-[#FFC300] text-black rounded-[8px]" onClick={handleGoHome}>Go Home</button>
            </span>
        </div>
    );
};

export default FreeOrderSuccess;
