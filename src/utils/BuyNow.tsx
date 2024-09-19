import { useMutation } from 'react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { userBuyNow } from '../api/mutation';
import Loading from '../loader';
import PaymentModal from './PaymentModal';

interface BuyNowButtonProps {
  productId: string;
  isUserAuthenticated: boolean;
}

const BuyNowButton = ({ productId, isUserAuthenticated }: BuyNowButtonProps) => {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
  
  const navigate = useNavigate();

  const { mutate: buyNowMutate } = useMutation(userBuyNow, {
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

      setIsModalOpen(true);
      setLoading(false);
    },
    onError: (error) => {
      console.log('Error:', error);
      setLoading(false);
    },
  });

  const handleBuyNowClick = () => {
    if (isUserAuthenticated) {
      setLoading(true);
      buyNowMutate(productId);
    } else {
      toast.error("Please login to buy this Product");
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }
  };

  return (
    <>
      <button
        className='w-[40%] h-[30px] bg-[#FFC300] rounded-[8px] text-[15px]'
        onClick={handleBuyNowClick}
        disabled={loading}
      >
        {loading ? <Loading /> : 'Buy Now'}
      </button>

      {/* Payment Modal */}
      {isModalOpen && (
        <PaymentModal
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          title="Proceed to Payment"
          amount={paymentDetails.amount}
          fee={paymentDetails.fee}
          primaryButton={{
            text: 'Continue',
            onClick: () => {}, // Payment logic
            display: true,
          }}
          secondaryButton={{
            text: 'Cancel',
            onClick: () => setIsModalOpen(false),
            display: true,
          }}
        />
      )}
    </>
  );
};

export default BuyNowButton;
