/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import { userBuyTicket } from '../api/mutation';
import { getCachedAuthData } from '../utils/auth.cache.utility';


interface PaymentDetails {
    amount: string;
    fee: string;
    paymentID: string;
    paymentAPI: string;
    payeeName: string;
    payeeEmail: string;
    checkoutURL: string;
    source: 'buyNow' | 'payNow';
}

export const useTicketActions = (
    setPaymentDetails?: (details: PaymentDetails) => void,
    setIsModalOpen?: (open: boolean) => void,
    isUserAuthenticated?: boolean
) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});

    const setItemLoading = (itemId: string, isLoading: boolean) => {
        setLoadingStates(prev => ({
            ...prev,
            [itemId]: isLoading
        }));
    };

    const { mutate: buyTicketWithAttendeesMutate } = useMutation(
        ['buyticket_with_attendees'],
        ({ ticketId, attendees }: { ticketId: string; attendees: string[] }) =>
            userBuyTicket(ticketId, attendees)
    );

    const handleBuyTicket = async (ticketId: string, attendees: string[] = []) => {
        const token = getCachedAuthData();

        if (!token) {
            localStorage.setItem("redirectPath", location.pathname);
            toast.error('Please login to purchase tickets');
            setTimeout(() => navigate('/login'), 2000);
            return;
        }

        if (!isUserAuthenticated) {
            toast.error('Please login to purchase tickets');
            navigate('/login');
            return;
        }

        setLoadingStates(prev => ({
            ...prev,
            [ticketId]: true
        }));

        try {
            buyTicketWithAttendeesMutate(
                { ticketId, attendees },
                {
                    onSuccess: (response) => {
                        if (setPaymentDetails && setIsModalOpen) {
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
                        } else {
                            toast.success('Ticket purchased successfully!');
                            queryClient.invalidateQueries(['events']); 
                        }

                        setLoadingStates(prev => ({
                            ...prev,
                            [ticketId]: false
                        }));
                    },
                    onError: (error) => {
                        console.error('Ticket purchase failed:', error);
                        toast.error('Failed to purchase ticket. Please try again.');
                        setLoadingStates(prev => ({
                            ...prev,
                            [ticketId]: false
                        }));
                    }
                }
            );
        } catch (error) {
            console.error('Ticket purchase error:', error);
            toast.error('An error occurred while purchasing the ticket');
            setLoadingStates(prev => ({
                ...prev,
                [ticketId]: false
            }));
        }
    };

    const isTicketLoading = (ticketId: string) => loadingStates[ticketId] || false;

    return {
        handleBuyTicket,
        loadingStates,
        isTicketLoading,
        setItemLoading
    };
};
