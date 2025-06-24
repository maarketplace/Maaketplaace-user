import React from 'react';
import Loading from "../../../loader";

export const EventLoadingState: React.FC = () => (
    <div className= "min-h-screen bg-gray-50 dark:bg-black pt-20 flex items-center justify-center" >
    <div className="text-center" >
        <Loading />
        <p className="text-gray-600 dark:text-gray-400 mt-4">Loading event details...</p>
    </div>
</div>
);