import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, User } from 'lucide-react';
import { EventApiResponse } from '../../../interface/ProductInterface';

const Loading = () => (
    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
);


interface RegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    event: EventApiResponse;
    onSubmit: (registrationData: { quantity: number; attendees: string[] }) => void;
    isLoading?: boolean;
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({
    isOpen,
    onClose,
    event,
    onSubmit,
    isLoading = false
}) => {
    const [quantity, setQuantity] = useState(1);
    const [attendees, setAttendees] = useState<string[]>(['']);
    const [errors, setErrors] = useState<string[]>([]);

    const eventDetails = event.data?.data?.event;
    const maxTickets = Math.min(10, (eventDetails?.totalTickets || 0) - (eventDetails?.ticketsSold || 0));


    useEffect(() => {
        if (isOpen) {
            setQuantity(1);
            setAttendees(['']);
            setErrors([]);
        }
    }, [isOpen]);

    useEffect(() => {
        const newAttendees = [...attendees];

        if (quantity > attendees.length) {
            for (let i = attendees.length; i < quantity; i++) {
                newAttendees.push('');
            }
        } else if (quantity < attendees.length) {
            newAttendees.splice(quantity);
        }

        setAttendees(newAttendees);
        setErrors([]);
    }, [quantity, attendees]);

    const handleAttendeeNameChange = (index: number, value: string) => {
        const newAttendees = [...attendees];
        newAttendees[index] = value;
        setAttendees(newAttendees);

        if (value.trim() && errors[index]) {
            const newErrors = [...errors];
            newErrors[index] = '';
            setErrors(newErrors);
        }
    };

    const validateForm = () => {
        const newErrors: string[] = [];
        let isValid = true;

        attendees.forEach((name, index) => {
            if (!name.trim()) {
                newErrors[index] = 'Name is required';
                isValid = false;
            } else {
                newErrors[index] = '';
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            onSubmit({
                quantity,
                attendees: attendees.map(name => name.trim())
            });
        }
    };

    const adjustQuantity = (change: number) => {
        const newQuantity = Math.max(1, Math.min(maxTickets, quantity + change));
        setQuantity(newQuantity);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Register for Event
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {eventDetails?.name && (
                        <div className="text-center">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                {eventDetails.name}
                            </h3>
                            {eventDetails.price && (
                                <p className="text-gray-600 dark:text-gray-400 mt-1">
                                    Price: {eventDetails.price}
                                </p>
                            )}
                        </div>
                    )}

                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Number of Tickets
                        </label>
                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => adjustQuantity(-1)}
                                disabled={quantity <= 1}
                                className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                                <Minus className="w-4 h-4" />
                            </button>

                            <span className="text-xl font-semibold text-gray-900 dark:text-white min-w-[2rem] text-center">
                                {quantity}
                            </span>

                            <button
                                type="button"
                                onClick={() => adjustQuantity(1)}
                                disabled={quantity >= maxTickets}
                                className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Maximum {maxTickets} tickets available
                        </p>
                    </div>

                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Attendee Names
                        </label>
                        <div className="space-y-3">
                            {attendees.map((name, index) => (
                                <div key={index} className="space-y-1">
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => handleAttendeeNameChange(index, e.target.value)}
                                            placeholder={`Attendee ${index + 1} name`}
                                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#ffc300] focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white ${errors[index] ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
                                                }`}
                                        />
                                    </div>
                                    {errors[index] && (
                                        <p className="text-sm text-red-500">{errors[index]}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {attendees.filter(name => name.trim()).length} of {quantity} names provided
                        </p>
                    </div>
                </div>

                <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading || attendees.filter(name => name.trim()).length !== quantity}
                        className="px-4 py-3 bg-[#ffc300] hover:bg-[#e0a800] text-black rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loading />
                                <span>Registering...</span>
                            </>
                        ) : (
                            `Register ${quantity} Ticket${quantity > 1 ? 's' : ''}`
                        )}
                    </button>
                </div>
            </div>
  
        </div>
    );
};

export default RegistrationModal;