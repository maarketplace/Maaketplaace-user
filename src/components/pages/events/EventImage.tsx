import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { EventApiResponse } from '../../../interface/ProductInterface';

interface EventImageProps {
    event: EventApiResponse;
}

export const EventImage: React.FC<EventImageProps> = ({ event }) => {
    const eventDetails = event.data?.data?.event;
    const images: string[] = eventDetails?.bannerImage ? [eventDetails.bannerImage] : [];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    if (!images.length) {
        return (
            <div className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">No image available</p>
            </div>
        );
    }

    return (
        <div className="relative">
            <div className="aspect-square bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg">
                <img
                    src={images[currentImageIndex]}
                    alt={eventDetails?.name || "Event image"}
                    className="w-full h-full object-cover"
                />
                {images.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </>
                )}
            </div>
            {images.length > 1 && (
                <div className="flex justify-center mt-4 space-x-2">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-3 h-3 rounded-full transition-colors ${index === currentImageIndex
                                    ? 'bg-blue-600'
                                    : 'bg-gray-300 dark:bg-gray-600'
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};