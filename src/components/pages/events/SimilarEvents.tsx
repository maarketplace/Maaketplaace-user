import React from 'react';
import { Calendar, MapPin, Users, Clock, ArrowRight } from 'lucide-react';
import Loading from "../../../loader";
import { EventApiResponse, EventDetails } from '../../../interface/ProductInterface';

interface SimilarEventsProps {
    events: EventApiResponse[];
    loadingStates: { [key: string]: boolean };
    onAction: (id: string, action: 'register' | 'bookmark' | 'share') => void;
    onNavigate: (id: string) => void;
}

export const SimilarEvents: React.FC<SimilarEventsProps> = ({
    events,
    loadingStates,
    onAction,
    onNavigate,
}) => {
    if (!events || events.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">No similar events found.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((eventApi, idx) => {
                const event = eventApi.data?.data?.event;
                if (!event) return null;
                return (
                    <EventCard
                        key={event.id || event._id || idx}
                        event={event}
                        isLoading={loadingStates[event.id || event._id]}
                        onAction={onAction}
                        onNavigate={onNavigate}
                    />
                );
            })}
        </div>
    );
};

interface EventCardProps {
    event: EventDetails;
    isLoading: boolean;
    onAction: (id: string, action: 'register' | 'bookmark' | 'share') => void;
    onNavigate: (id: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({
    event,
    isLoading,
    onAction,
    onNavigate,
}) => {
    const isEventFull = typeof event.totalTickets === "number" && typeof event.ticketsSold === "number" && event.ticketsSold >= event.totalTickets;
    const isEventPast = event.endDate ? new Date(event.endDate) < new Date() : false;
    const eventDate = event.startDate ? new Date(event.startDate) : null;

    return (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="relative h-48 bg-gray-200 dark:bg-gray-800">
                {event.bannerImage ? (
                    <img
                        src={event.bannerImage}
                        alt={event.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Calendar className="w-12 h-12 text-gray-400" />
                    </div>
                )}

                {event.price && (
                    <div className="absolute top-2 right-2">
                        <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                            {event.price}
                        </span>
                    </div>
                )}
            </div>

            <div className="p-6">
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                        {event.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {event.description?.replace(/<[^>]*>/g, '') || 'No description available'}
                    </p>
                </div>

                <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                        <span>
                            {eventDate ? eventDate.toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            }) : ''}
                        </span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4 mr-2 text-blue-600" />
                        <span>
                            {eventDate ? eventDate.toLocaleTimeString('en-US') : ''}
                        </span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                        <span className="truncate">{event.location}</span>
                    </div>

                    {(typeof event.totalTickets === "number") && (
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Users className="w-4 h-4 mr-2 text-blue-600" />
                            <span>{event.ticketsSold ?? 0} / {event.totalTickets}</span>
                        </div>
                    )}
                </div>

                <div className="mb-4">
                    <span className="inline-block bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-xs">
                        {event.category}
                    </span>
                </div>

                <div className="space-y-2">
                    <button
                        onClick={() => onAction(event.id || event._id, 'register')}
                        disabled={isLoading || isEventFull || isEventPast}
                        className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition-colors ${isEventFull || isEventPast
                            ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center gap-2">
                                <Loading />
                                <span>Processing...</span>
                            </div>
                        ) : (
                            <span>
                                {isEventPast
                                    ? 'Event Ended'
                                    : isEventFull
                                        ? 'Event Full'
                                        : 'Register Now'
                                }
                            </span>
                        )}
                    </button>

                    <button
                        onClick={() => onNavigate(event.id || event._id)}
                        className="w-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
                    >
                        <span>View Details</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};