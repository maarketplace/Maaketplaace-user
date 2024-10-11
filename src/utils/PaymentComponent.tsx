import { toast } from 'react-hot-toast'; 
import { UseMutateFunction } from 'react-query';
import { AxiosResponse } from 'axios';

interface ISetPaymentDetails {
  (details: {
    amount: string;
    fee: string;
    paymentID: string;
    paymentAPI: string;
    payeeName: string;
    payeeEmail: string;
    checkoutURL: string;
    source: 'buyNow' | 'payNow';
  }): void;
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BuyMutateFunction = UseMutateFunction<AxiosResponse<any, any>, unknown, string, unknown>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PayNowMutateFunction = UseMutateFunction<AxiosResponse<any, any>, unknown, string, unknown>;

export const handleBuyNow = (
  id: string,
  isAuthenticated: boolean,
  setLoadingStates: React.Dispatch<React.SetStateAction<Record<string, boolean>>>,
  setPaymentDetails: ISetPaymentDetails,
  setIsModalOpen: (value: boolean) => void,
  buyMutate: BuyMutateFunction, 
  navigate: (path: string) => void
) => {
  if (isAuthenticated) {
    setLoadingStates((prevState) => ({
      ...prevState,
      [id]: true,
    }));

    buyMutate(id, {
      onSuccess: (response) => {
        const paymentAmount = response?.data?.data?.data?.amount || '₦0';
        const paymentFee = response?.data?.data?.data?.transaction_fee || '₦0';
        const paymentID = response?.data?.data?.data?._id || '';
        const paymentAPI = response?.data?.data?.paymentData?.payment_type || '';

        setPaymentDetails({
          amount: paymentAmount,
          fee: paymentFee,
          paymentID,
          paymentAPI,
          payeeName: '',
          payeeEmail: '',
          checkoutURL: '',
          source: 'buyNow',
        });

        setTimeout(() => {
          setIsModalOpen(true);
        }, 2000);

        setLoadingStates((prevState) => ({
          ...prevState,
          [id]: false,
        }));
      },
      onError: (error: unknown) => {
        console.log('Error:', error);
        setLoadingStates((prevState) => ({
          ...prevState,
          [id]: false,
        }));
      },
    });
  } else {
    toast.error('Please login to buy this Product');
    navigate('/');
  }
};

export const handlePayNow = (
  payNowMutate: PayNowMutateFunction, // use the updated type
  paymentID: string,
  setPaymentDetails: ISetPaymentDetails,
  setIsModalOpen: (value: boolean) => void
) => {
  payNowMutate(paymentID, {
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
        paymentAPI,
        payeeName, 
        payeeEmail,
        checkoutURL,
        source: 'payNow',
      });

      setTimeout(() => {
        setIsModalOpen(true);
      }, 2000);
    },
    onError: (error: unknown) => {
      setIsModalOpen(false);
      console.log(error);
    },
  });
};

