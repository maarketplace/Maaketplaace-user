import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import { userBuyNow, userPayWithKora } from '../api/mutation';

export function usePayment(isUserAuthenticated: boolean) {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(true); // Modal visibility state
    const [paymentDetails, setPaymentDetails] = useState({
        amount: '',
        fee: '',
        paymentID: '',
        paymentAPI: '',
        payeeName: '',
        payeeEmail: '',
        checkoutURL: '',
        source: '',
    });
    const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});

    const { mutate: buyMutate } = useMutation(['buynow'], userBuyNow, {
        onSuccess: (response) => {
            const paymentAmount = response?.data?.data?.data?.amount || '₦0';
            const paymentFee = response?.data?.data?.data?.transaction_fee || '₦0';
            const paymentID = response?.data?.data?.data?._id;
            const paymentAPI = response?.data?.data?.paymentData?.payment_type;

            setPaymentDetails({
                amount: paymentAmount,
                fee: paymentFee,
                paymentID: paymentID,
                paymentAPI: paymentAPI,
                payeeName: '',
                payeeEmail: '',
                checkoutURL: '',
                source: 'buyNow',
            });

            setTimeout(() => {
                setIsModalOpen(true); // Open the modal after setting the payment details
                setLoadingStates({});
            }, 2000);
        },
        onError: (error) => {
            console.error('Error:', error);
            setLoadingStates({});
        },
    });

    const { mutate: payNowMutate, isLoading: paymutateLoading } = useMutation(['paynow'], userPayWithKora, {
        onSuccess: (data) => {
            const innerData = data?.data?.data?.data?.data?.data;
            const paymentData = data?.data?.data?.data?.paymentData;
            const paymentAmount = paymentData?.amount || '₦0';
            const payeeName = paymentData?.customer?.name || '';
            const payeeEmail = paymentData?.customer?.email || '';
            const paymentAPI = paymentData?.payment_type || '';
            const checkoutURL = innerData?.checkout_url || '';

            setPaymentDetails({
                amount: paymentAmount,
                fee: '',
                paymentID: paymentData?._id || '',
                paymentAPI: paymentAPI,
                payeeName: payeeName,
                payeeEmail: payeeEmail,
                checkoutURL: checkoutURL,
                source: 'payNow',
            });

            setTimeout(() => {
                setIsModalOpen(true); // Open the modal after setting the payment details
                setLoadingStates({});
            }, 2000);
        },
        onError: (error) => {
            setLoadingStates({});
            console.error(error);
        },
    });

    const handleCartAddingAuth = (id: string) => {
        if (isUserAuthenticated) {
            setLoadingStates((prevState) => ({
                ...prevState,
                [id]: true,
            }));

            buyMutate(id, {
                onSuccess: () => {
                    setLoadingStates((prevState) => ({
                        ...prevState,
                        [id]: false,
                    }));
                },
                onError: (error) => {
                    setLoadingStates((prevState) => ({
                        ...prevState,
                        [id]: false,
                    }));
                    console.error('Error:', error);
                },
            });
        } else {
            navigate('/');
        }
    };

    const handlePayment = (paymentData: string) => {
        payNowMutate(paymentData);
    };

    return {
        paymentDetails,
        loadingStates,
        isModalOpen, // Return the modal open state
        setIsModalOpen, // Return the function to toggle modal open state
        handleCartAddingAuth,
        handlePayment,
        paymutateLoading,
    };
}
