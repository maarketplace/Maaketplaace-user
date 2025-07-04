import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface PaymentDetails {
    amount: string;
    fee: string;
    paymentID: string;
    paymentAPI: string;
    payeeName: string;
    payeeEmail: string;
    checkoutURL: string;
    source: string;
}

export const usePaymentModal = () => {
    const navigate = useNavigate();
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
        amount: '',
        fee: '',
        paymentID: '',
        paymentAPI: '',
        payeeName: '',
        payeeEmail: '',
        checkoutURL: '',
        source: '',
    });

    const handleCheckout = () => {
        if (paymentDetails.amount === '₦0') {
            navigate('/free-order-summary');
            return;
        } else {
            if (iframeRef.current) {
                iframeRef.current.style.display = 'block';
                iframeRef.current.src = paymentDetails.checkoutURL;
            }
        }
    };

    useEffect(() => {
        if (!paymentDetails.checkoutURL) {
            return;
        }

        const handleResponse = (event: { origin: string; data: string }) => {
            if (event.origin === new URL(paymentDetails.checkoutURL).origin) {
                const parsedData = JSON.parse(event.data);
                const paymentData = parsedData.data;

                if (paymentData && paymentData.reference) {
                    localStorage.setItem('orderRefrence', paymentData.reference);
                }

                const result = parsedData.result;
                switch (result) {
                    case 'success':
                        console.log('Payment successful, redirecting to success page...');
                        navigate('/order-success')
                        break;
                    case 'failued':
                        navigate('/order-failure')
                        break;
                    case 'pending':
                        break;
                    default:
                        console.log('Unknown result, handling default case...');
                        navigate('/order-failure')
                        break;
                }
            }
        };

        window.addEventListener('message', handleResponse);
        return () => {
            window.removeEventListener('message', handleResponse);
        };
    }, [navigate, paymentDetails.checkoutURL, setIsModalOpen]);

    return {
        iframeRef,
        isModalOpen,
        setIsModalOpen,
        paymentDetails,
        setPaymentDetails,
        handleCheckout,
    };
};
