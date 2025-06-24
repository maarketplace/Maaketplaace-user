import React from 'react';
import { Calendar, Clock, MapPin, Users, Tag, User } from 'lucide-react';
import { EventApiResponse } from '../../../interface/ProductInterface';

interface EventInfoProps {
    event: EventApiResponse;
}

export const EventInfo: React.FC<EventInfoProps> = ({ event }) => {
    const eventDetails = event.data?.data?.event;

    if (!eventDetails) {
        return (
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Event Information
                </h3>
                <p className="text-gray-600 dark:text-gray-400">No event details available.</p>
            </div>
        );
    }

    const {
        startDate,
        location,
        merchant,
        category,
        totalTickets,
        ticketsSold,
        price,
    } = eventDetails;

    return (
        <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Event Information
            </h3>
            <div className="space-y-4">
                <div className="flex items-start space-x-3">
                    <Calendar className="w-5 h-5 text-[#ffc300] mt-0.5" />
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Start Date</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                            {startDate ? new Date(startDate).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            }) : ''}
                        </p>
                    </div>
                </div>

                <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-[#ffc300] mt-0.5" />
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Start Time</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                            {startDate ? new Date(startDate).toLocaleTimeString('en-US') : ''}
                        </p>
                    </div>
                </div>

                <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-[#ffc300] mt-0.5" />
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Location</p>
                        <p className="font-medium text-gray-900 dark:text-white">{location || ''}</p>
                    </div>
                </div>

                <div className="flex items-start space-x-3">
                    <User className="w-5 h-5 text-[#ffc300] mt-0.5" />
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Organizer</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                            {merchant?.business_name || merchant?.fullName || ''}
                        </p>
                    </div>
                </div>

                <div className="flex items-start space-x-3">
                    <Tag className="w-5 h-5 text-[#ffc300] mt-0.5" />
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Category</p>
                        <p className="font-medium text-gray-900 dark:text-white">{category || ''}</p>
                    </div>
                </div>

                {(typeof totalTickets === 'number') && (
                    <div className="flex items-start space-x-3">
                        <Users className="w-5 h-5 text-[#ffc300] mt-0.5" />
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Capacity</p>
                            <p className="font-medium text-gray-900 dark:text-white">
                                {(ticketsSold ?? 0)} / {totalTickets} registered
                            </p>
                        </div>
                    </div>
                )}

                {price && (
                    <div className="flex items-start space-x-3">
                        <div className="w-5 h-5 text-[#ffc300] mt-0.5 flex items-center justify-center">
                            <span className="text-sm font-bold">₦</span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Price</p>
                            <p className="font-medium text-gray-900 dark:text-white">
                                {price}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};