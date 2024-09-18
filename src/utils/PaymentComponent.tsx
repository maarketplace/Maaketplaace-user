import { useState } from 'react';
import { useMutation } from 'react-query';

import toast from 'react-hot-toast';

import { useNavigate } from 'react-router-dom';
import PaymentModal from './PaymentModal';
// import Loading from '../loader';
import { userBuyNow, userPayWithKora } from '../api/mutation';

interface PaymentComponentProps {
  productId: string;
  isUserAuthenticated: boolean;
  userId: string;
}

const PaymentComponent: React.FC<PaymentComponentProps> = ({ productId, isUserAuthenticated, userId }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
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

  const { mutate: buyMutate } = useMutation(userBuyNow);
  const { mutate: payNowMutate, isLoading: paymutateLoading } = useMutation(userPayWithKora);

  const handleBuyNow = () => {
    if (isUserAuthenticated) {
      setLoadingStates(prev => ({ ...prev, [productId]: true }));

      buyMutate(productId, {
        onSuccess: (response) => {
          const paymentData = response?.data?.data?.data || {};
          setPaymentDetails({
            amount: paymentData.amount || '₦0',
            fee: paymentData.transaction_fee || '₦0',
            paymentID: paymentData._id || '',
            paymentAPI: paymentData.payment_type || '',
            payeeName: '',
            payeeEmail: '',
            checkoutURL: '',
            source: 'buyNow',
          });

          setTimeout(() => {
            setIsModalOpen(true);
          }, 2000);

          setLoadingStates(prev => ({ ...prev, [productId]: false }));
        },
        onError: (error) => {
          console.log('Error:', error);
          setLoadingStates(prev => ({ ...prev, [productId]: false }));
        },
      });
    } else {
      navigate('/');
      toast.error('Please login to proceed');
    }
  };

  const handlePayNow = () => {
    payNowMutate(paymentDetails.paymentID, {
      onSuccess: (data) => {
        const paymentData = data?.data?.data?.paymentData || {};
        const checkoutData = data?.data?.data?.data?.data || {};

        setPaymentDetails({
          ...paymentDetails,
          amount: paymentData.amount || '₦0',
          payeeName: paymentData.customer?.name || '',
          payeeEmail: paymentData.customer?.email || '',
          paymentAPI: paymentData.payment_type || '',
          checkoutURL: checkoutData?.checkout_url || '',
          source: 'payNow',
        });

        setTimeout(() => {
          setIsModalOpen(true);
        }, 2000);
      },
      onError: (error) => {
        console.log('Payment Error:', error);
        setIsModalOpen(false);
      },
    });
  };

  return (
    <>
      {isModalOpen && (
        <PaymentModal
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          title={paymentDetails.source === 'payNow' ? "Complete Your Payment" : "Proceed to Payment"}
          amount={paymentDetails.amount}
          fee={paymentDetails.source === 'buyNow' ? paymentDetails.fee : ''}
          paymentAPI={paymentDetails.source === 'payNow' ? paymentDetails.paymentAPI : ''}
          payeeEmail={paymentDetails.source === 'payNow' ? paymentDetails.payeeEmail : ''}
          payeeName={paymentDetails.source === 'payNow' ? paymentDetails.payeeName : ''}
          primaryButton={{
            text: paymentDetails.source === 'payNow' ? (
              <a href={paymentDetails.checkoutURL} rel="noopener noreferrer">
                <button className="w-[70%] h-[30px] bg-[#FFC300] text-black rounded-[8px] text-[14px]">
                  {paymutateLoading ? "Paying..." : "Pay Now"}
                </button>
              </a>
            ) : null,
          }}
        />
      )}
    </>
  );
};

export default PaymentComponent;
