import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import Loading from "../../../loader";
import { EventApiResponse } from '../../../interface/ProductInterface';
import RegistrationModal from './RegistrationModal';
import { useTicketActions } from '../../../hooks/useTicketAction';
import { useUser } from '../../../context/GetUser';
import { usePaymentActions } from '../../../hooks/usePaymentActions';
import PaymentModal from '../../../utils/PaymentModal';

interface EventActionButtonProps {
    event: EventApiResponse;
    loadingStates: { [key: string]: boolean };
    onAction: (id: string, action: 'register' | 'bookmark' | 'share') => void;
}

export const EventActionButton: React.FC<EventActionButtonProps> = ({
    event,
    loadingStates,
    onAction,
}) => {
    const { user } = useUser();
    const isUserAuthenticated = !!user;
    const [showRegistrationModal, setShowRegistrationModal] = useState(false);
    const [registrationLoading, setRegistrationLoading] = useState(false);

    const eventDetails = event.data?.data?.event;

    const {
        isModalOpen,
        setIsModalOpen,
        paymentDetails,
        setPaymentDetails,
        payLoadingState,
        iframeRef,
        handleCheckout,
        handlePayment
    } = usePaymentActions();

    const { handleBuyTicket } = useTicketActions(
        setPaymentDetails,
        setIsModalOpen,
        isUserAuthenticated
    );

    if (!eventDetails) {
        return null;
    }

    const {
        _id,
        id,
        startDate,
        endDate,
        totalTickets,
        ticketsSold,
        price,
    } = eventDetails;

    const eventCapacity = totalTickets;
    const registeredCount = ticketsSold;
    const isActive = true;
    const eventPrice = price;
    const eventDate = endDate || startDate;
    const isEventFull = typeof eventCapacity === 'number' && typeof registeredCount === 'number' && registeredCount >= eventCapacity;
    const isEventPast = eventDate ? new Date(eventDate) < new Date() : false;

    const handleRegisterClick = () => {
        if (!isEventFull && !isEventPast && isActive) {
                setShowRegistrationModal(true);
        }
    };

    const handleRegistrationSubmit = async (registrationData: { quantity: number; attendees: string[] }) => {
        setRegistrationLoading(true);
        try {
            await handleBuyTicket(id || _id, registrationData.attendees);
            setShowRegistrationModal(false);
            onAction(id || _id, 'register');
        } catch (error) {
            console.error('Registration failed:', error);
        } finally {
            setRegistrationLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <button
                onClick={handleRegisterClick}
                disabled={loadingStates[id || _id] || isEventFull || isEventPast || !isActive}
                className={`w-full py-4 px-6 rounded-lg font-light text-lg transition-all ${isEventFull || isEventPast || !isActive
                    ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-[#ffc300] hover:bg-[#e0a800] text-black shadow-lg hover:shadow-xl'
                    }`}
            >
                {loadingStates[id || _id] ? (
                    <div className="flex items-center justify-center gap-3">
                        <Loading />
                        <span>Processing...</span>
                    </div>
                ) : (
                    <div className="flex items-center justify-center gap-3">
                        <Calendar className="w-6 h-6" />
                        <span>
                            {isEventPast
                                ? 'Event Ended'
                                : isEventFull
                                    ? 'Event Full'
                                    : !isActive
                                        ? 'Event Inactive'
                                        : (eventPrice && Number(eventPrice) != 0)
                                            ? `Register - ${eventPrice}`
                                            : 'Register for Free'
                            }
                        </span>
                    </div>
                )}
            </button>

            <RegistrationModal
                isOpen={showRegistrationModal}
                onClose={() => setShowRegistrationModal(false)}
                event={event}
                onSubmit={handleRegistrationSubmit}
                isLoading={registrationLoading}
            />

            {isModalOpen && (
                <PaymentModal
                    isOpen={isModalOpen}
                    setIsOpen={setIsModalOpen}
                    title={paymentDetails?.source === 'payNow' ? "Complete Your Payment" : "Proceed to Payment"}
                    amount={paymentDetails?.amount}
                    fee={paymentDetails?.source === 'buyNow' ? paymentDetails?.fee : ''}
                    paymentAPI={paymentDetails?.source === 'payNow' ? paymentDetails?.paymentAPI : ''}
                    payeeEmail={paymentDetails?.source === 'payNow' ? paymentDetails?.payeeEmail : ''}
                    payeeName={paymentDetails?.source === 'payNow' ? paymentDetails?.payeeName : ''}
                    primaryButton={{
                        text: paymentDetails?.source === 'payNow' ? (
                            <button
                                className="w-[70%] h-[30px] bg-[#FFC300] text-black rounded-[8px] text-[14px]"
                                onClick={handleCheckout}
                            >
                                Pay Now
                            </button>
                        ) : (
                            <button
                                className="w-[70%] h-[30px] bg-[#FFC300] text-black rounded-[8px] text-[14px]"
                                onClick={() => {
                                    handlePayment(paymentDetails?.paymentID)
                                    console.log('Payment ID from details:', paymentDetails.paymentID);
                                }}
                            >
                                {payLoadingState[paymentDetails.paymentID] ? <span>Loading...</span> : 'Continue'}
                            </button>
                        ),
                        display: true,
                        primary: true,
                    }}
                    secondaryButton={{
                        text: "Cancel",
                        onClick: () => setIsModalOpen(false),
                        display: true,
                        primary: false,
                    }}
                />
            )}

            {paymentDetails.checkoutURL && (
                <iframe
                    ref={iframeRef}
                    src={paymentDetails.checkoutURL}
                    className="fixed inset-0 w-full h-full z-50"
                    style={{ display: 'none' }}
                    title="Payment Checkout"
                />
            )}
        </div>
    );
};
