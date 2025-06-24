import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface EventErrorStateProps {
    onRetry: () => void;
}

export const EventErrorState: React.FC<EventErrorStateProps> = ({ onRetry }) => (
    <div className="min-h-screen bg-gray-50 dark:bg-black pt-20 flex items-center justify-center">
        <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Failed to Load Event
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
                We couldn't load the event details. Please try again.
            </p>
            <button
                onClick={onRetry}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center mx-auto"
            >
                <RefreshCw className="w-5 h-5 mr-2" />
                Try Again
            </button>
        </div>
    </div>
);