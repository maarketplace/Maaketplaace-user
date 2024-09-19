import { useState } from 'react';
import { useMutation } from 'react-query';
import toast from 'react-hot-toast';
import { userPayWithKora } from '../api/mutation';
import Loading from '../loader';
import PaymentModal from './PaymentModal';


interface PaymentComponentProps {
  paymentSource: 'payNow';
  productId: string;
  onClose: () => void;
}

const PaymentComponent = ({ paymentSource, productId }: PaymentComponentProps) => {
  const [paymentDetails, setPaymentDetails] = useState({
    amount: '',
    fee: '',
    paymentID: '',
    paymentAPI: '',
    payeeName: '',
    payeeEmail: '',
    checkoutURL: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { mutate: payNowMutate, isLoading: paymutateLoading } = useMutation(userPayWithKora, {
    onSuccess: (data) => {
      const paymentData = data?.data?.data?.paymentData || {};
      const checkoutURL = data?.data?.data?.data?.data?.checkout_url || '';
      setPaymentDetails({
        amount: paymentData.amount || '₦0',
        fee: '',
        paymentID: paymentData._id || '',
        paymentAPI: paymentData.payment_type || '',
        payeeName: paymentData.customer?.name || '',
        payeeEmail: paymentData.customer?.email || '',
        checkoutURL,
      });
      setIsModalOpen(true);
    },
    onError: (error) => {
      console.error('Payment Error:', error);
      toast.error("Error while processing the payment");
      setIsModalOpen(false);
    },
  });

  const handlePayment = () => {
    if (paymentSource === 'payNow') {
      payNowMutate(productId);
    }
  };

  return (
    <>
      <button
        className="w-[70%] h-[30px] bg-[#FFC300] rounded-[8px] text-[15px]"
        onClick={handlePayment}
        disabled={paymutateLoading}
      >
        {paymutateLoading ? <Loading /> : 'Proceed to Payment'}
      </button>

      {isModalOpen && (
        <PaymentModal
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          title="Complete Your Payment"
          amount={paymentDetails.amount}
          paymentAPI={paymentDetails.paymentAPI}
          payeeEmail={paymentDetails.payeeEmail}
          payeeName={paymentDetails.payeeName}
          primaryButton={{
            text: (
              <a href={paymentDetails.checkoutURL} rel="noopener noreferrer">
                <button className="w-[70%] h-[30px] bg-[#FFC300] text-black rounded-[8px] text-[14px]">
                  {paymutateLoading ? 'Paying' : 'Pay Now'}
                </button>
              </a>
            ),
            display: true,
            primary: true,
          }}
          secondaryButton={{
            text: 'Cancel',
            onClick: () => setIsModalOpen(false),
            display: true,
            primary: true,
          }}
        />
      )}
    </>
  );
};

export default PaymentComponent;
