import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface EventBreadcrumbProps {
    eventName?: string;
    onNavigateHome: () => void;
    onNavigateEvents: () => void;
}

export const EventBreadcrumb: React.FC<EventBreadcrumbProps> = ({
    eventName,
    onNavigateHome,
    onNavigateEvents,
}) => (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-8">
        <button
            onClick={onNavigateHome}
            className="hover:text-gray-900 dark:hover:text-white transition-colors flex items-center"
        >
            <Home className="w-4 h-4 mr-1" />
            Home
        </button>
        <ChevronRight className="w-4 h-4" />
        <button
            onClick={onNavigateEvents}
            className="hover:text-gray-900 dark:hover:text-white transition-colors"
        >
            Events
        </button>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 dark:text-white font-medium truncate">
            {eventName || 'Event Details'}
        </span>
    </nav>
);