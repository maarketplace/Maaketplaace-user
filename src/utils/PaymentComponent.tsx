/* eslint-disable @typescript-eslint/no-explicit-any */
import { UseMutateFunction } from 'react-query';
import { AxiosResponse } from 'axios';
import toast from 'react-hot-toast';

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
        }, 1000);

        setLoadingStates((prevState) => ({
          ...prevState,
          [id]: false,
        }));
      },
      onError: (error: unknown) => {
        console.log('Error:', error);
        toast.error('Purchase failed. Please try again.');
        setLoadingStates((prevState) => ({
          ...prevState,
          [id]: false,
        }));
      },
    });
  } else {
    toast.error('Please login to buy this Product');
    navigate('/login');
  }
};

export const handleTicketBuyNow = (
  ticketId: string,
  attendees: string[],
  isAuthenticated: boolean,
  setLoadingStates: React.Dispatch<React.SetStateAction<Record<string, boolean>>>,
  setPaymentDetails: ISetPaymentDetails,
  setIsModalOpen: (value: boolean) => void,
  ticketBuyMutate: UseMutateFunction<AxiosResponse<any, any>, unknown, { ticketId: string; attendees: string[] }, unknown>,
  navigate: (path: string) => void
) => {
  if (isAuthenticated) {
    setLoadingStates((prevState) => ({
      ...prevState,
      [ticketId]: true,
    }));

    ticketBuyMutate(
      { ticketId, attendees },
      {
        onSuccess: (response) => {
          const paymentAmount = response?.data?.data?.data?.amount || '₦0';
          const paymentFee = response?.data?.data?.data?.transaction_fee || '₦0';
          const paymentID = response?.data?.data?.data?._id || '';
          const paymentAPI = response?.data?.data?.paymentData?.payment_type || '';

          // Check if it's a free ticket
          const amount = parseFloat(paymentAmount.replace(/[^\d.]/g, ''));
          if (amount === 0) {
            toast.success('Free ticket registered successfully!');
            setLoadingStates((prevState) => ({
              ...prevState,
              [ticketId]: false,
            }));
            return;
          }

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
          }, 1000);

          setLoadingStates((prevState) => ({
            ...prevState,
            [ticketId]: false,
          }));
        },
        onError: (error: unknown) => {
          console.log('Ticket purchase error:', error);
          toast.error('Ticket purchase failed. Please try again.');
          setLoadingStates((prevState) => ({
            ...prevState,
            [ticketId]: false,
          }));
        },
      }
    );
  } else {
    toast.error('Please login to buy this ticket');
    navigate('/login');
  }
};

export const handlePayNow = (
  payNowMutate: PayNowMutateFunction,
  paymentID: string,
  setPaymentDetails: ISetPaymentDetails,
  setIsModalOpen: (value: boolean) => void,
  setPayLoadingStates: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
) => {
  setPayLoadingStates((prevState) => ({
    ...prevState,
    [paymentID]: true,
  }));

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

      setPayLoadingStates((prevState) => ({
        ...prevState,
        [paymentID]: false,
      }));
    },
    onError: () => {
      toast.error('Payment initialization failed. Please try again.');
      setPayLoadingStates((prevState) => ({
        ...prevState,
        [paymentID]: false,
      }));
      setIsModalOpen(false);
    },
  });
};

