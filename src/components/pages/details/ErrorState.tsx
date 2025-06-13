import React from 'react';

interface ErrorStateProps {
    onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ onRetry }) => {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <p className="text-red-600 dark:text-red-400 text-lg mb-4">Failed to load product</p>
                <button
                    onClick={onRetry}
                    className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-lg"
                >
                    Retry
                </button>
            </div>
        </div>
    );
};