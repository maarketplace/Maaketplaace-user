import React from 'react';
import { Clock, User, Award, List } from 'lucide-react';
import { EventApiResponse } from '../../../interface/ProductInterface';

interface EventTabContentProps {
    event: EventApiResponse;
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export const EventTabContent: React.FC<EventTabContentProps> = ({
    event,
    activeTab,
    setActiveTab,
}) => {
    // Extract event details from nested API response
    const eventDetails = event.data?.data?.data?.event;

    // Extra safety
    if (!eventDetails) {
        return (
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
                <p className="text-gray-500 dark:text-gray-400">No event data available.</p>
            </div>
        );
    }

    // Fallbacks for optional fields
    const {
        description,
        requirements,
        tags,
        agenda,
        speakers,
        sponsors
    } = eventDetails;

    const tabs = [
        { id: 'about', label: 'About', icon: List },
        { id: 'agenda', label: 'Agenda', icon: Clock },
        { id: 'speakers', label: 'Speakers', icon: User },
        { id: 'sponsors', label: 'Sponsors', icon: Award },
    ];

    const availableTabs = tabs.filter(tab => {
        switch (tab.id) {
            case 'agenda':
                return agenda && Array.isArray(agenda) && agenda.length > 0;
            case 'speakers':
                return speakers && Array.isArray(speakers) && speakers.length > 0;
            case 'sponsors':
                return sponsors && Array.isArray(sponsors) && sponsors.length > 0;
            default:
                return true;
        }
    });

    return (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg">
            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-8 px-6">
                    {availableTabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>
            </div>

            <div className="p-6">
                {activeTab === 'about' && (
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                                About This Event
                            </h4>
                            <div
                                className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
                                dangerouslySetInnerHTML={{ __html: description || 'No description available.' }}
                            />
                        </div>

                        {requirements && requirements.length > 0 && (
                            <div>
                                <h4 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                                    Requirements
                                </h4>
                                <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                                    {requirements.map((req: string, index: number) => (
                                        <li key={index}>{req}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {tags && tags.length > 0 && (
                            <div>
                                <h4 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                                    Tags
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {tags.map((tag: string, index: number) => (
                                        <span
                                            key={index}
                                            className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'agenda' && agenda && (
                    <div className="space-y-4">
                        <h4 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">
                            Event Agenda
                        </h4>
                        <div className="space-y-4">
                            {agenda.map((item: any, index: number) => (
                                <div key={index} className="flex space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <div className="flex-shrink-0">
                                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                            {item.time}
                                        </span>
                                    </div>
                                    <div className="flex-grow">
                                        <h5 className="font-medium text-gray-900 dark:text-white">
                                            {item.activity}
                                        </h5>
                                        {item.speaker && (
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                Speaker: {item.speaker}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'speakers' && speakers && (
                    <div className="space-y-4">
                        <h4 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">
                            Speakers
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {speakers.map((speaker: any, index: number) => (
                                <div key={index} className="flex space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    {speaker.image && (
                                        <img
                                            src={speaker.image}
                                            alt={speaker.name}
                                            className="w-16 h-16 rounded-full object-cover"
                                        />
                                    )}
                                    <div className="flex-grow">
                                        <h5 className="font-medium text-gray-900 dark:text-white">
                                            {speaker.name}
                                        </h5>
                                        <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">
                                            {speaker.title}
                                        </p>
                                        {speaker.bio && (
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {speaker.bio}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'sponsors' && sponsors && (
                    <div className="space-y-4">
                        <h4 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">
                            Sponsors
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {sponsors.map((sponsor: any, index: number) => (
                                <div key={index} className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <img
                                        src={sponsor.logo}
                                        alt={sponsor.name}
                                        className="w-20 h-20 object-contain mx-auto mb-2"
                                    />
                                    <h5 className="font-medium text-gray-900 dark:text-white text-sm">
                                        {sponsor.name}
                                    </h5>
                                    {sponsor.website && (
                                        <a
                                            href={sponsor.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                                        >
                                            Visit Website
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};