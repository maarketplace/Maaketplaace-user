import React, { useEffect, useState } from 'react';
import { useQuery } from "react-query";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getOneEvent } from "../../../api/query";
import { useUser } from '../../../context/GetUser';
import toast from "react-hot-toast";
import { getCachedAuthData } from "../../../utils/auth.cache.utility";

import { EventBreadcrumb } from './EventBreadcrumb';
import { EventErrorState } from './EventErrorState';
import { EventLoadingState } from './EventLoadingState';
import { EventImage } from './EventImage';
import { EventActionButton } from './EventActionButton';
import { SimilarEvents } from './SimilarEvents';
import { EventTabContent } from './EventTabContent';
import { EventInfo } from './EventInfo';
import { EventApiResponse } from '../../../interface/ProductInterface';

const EventDetails: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id: eventIdParam } = useParams<{ id?: string }>();
    const [event, setEvent] = useState<EventApiResponse | null>(null);
    const { fetchUser } = useUser();
    const [activeTab, setActiveTab] = useState('about');
    const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});

    const { data, isLoading, error } = useQuery(
        ['getoneevent', eventIdParam],
        () => getOneEvent(eventIdParam as string),
        {
            enabled: !!eventIdParam,
            refetchOnWindowFocus: false,
            staleTime: 5 * 60 * 1000, 
            cacheTime: 30 * 60 * 1000, 
        }
    );

    const similarTypeEvents: EventApiResponse[] | undefined = data?.data?.data?.similarType;
    const similarCategoryEvents: EventApiResponse[] | undefined = data?.data?.data?.similarCategory;

    useEffect(() => {
        setEvent(data?.data ? data?.data : null); 
    }, [data]);

    useEffect(() => {
        const getToken = getCachedAuthData();
        if (getToken !== null) {
            fetchUser().then(() => {
            }).catch(error => {
                toast.error(error?.message);
            });
        }
    }, [fetchUser]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleEventAction = (id: string, action: 'register' | 'bookmark' | 'share') => {
        const getToken = getCachedAuthData();
        if (getToken !== null) {
            setLoadingStates(prev => ({ ...prev, [id]: true }));

            switch (action) {
                case 'register':
                    handleEventRegistration(id);
                    break;
                case 'bookmark':
                    handleEventBookmark(id);
                    break;
                case 'share':
                    handleEventShare(id);
                    break;
                default:
                    break;
            }
        } else {
            localStorage.setItem("redirectPath", location.pathname);
            toast.error('Please login to perform this action');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        }
    };

    const handleEventRegistration = (id: string) => {
        setTimeout(() => {
            setLoadingStates(prev => ({ ...prev, [id]: false }));
            toast.success('Successfully registered for event!');
        }, 2000);
    };

    const handleEventBookmark = (id: string) => {
        setTimeout(() => {
            setLoadingStates(prev => ({ ...prev, [id]: false }));
            toast.success('Event bookmarked!');
        }, 1000);
    };

    const handleEventShare = (id: string) => {
        const eventDetails = event?.data?.data?.event;
        if (navigator.share) {
            navigator.share({
                title: eventDetails?.name || 'Check out this event',
                text: eventDetails?.description?.replace(/<[^>]*>/g, '') || 'Interesting event to attend',
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Event link copied to clipboard!');
        }
        setLoadingStates(prev => ({ ...prev, [id]: false }));
    };

    if (isLoading) {
        return <EventLoadingState />;
    }

    if (error || !event) {
        return <EventErrorState onRetry={() => window.location.reload()} />;
    }

    const eventDetails = event?.data?.data?.event;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black pt-20 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <EventBreadcrumb
                    eventName={eventDetails?.name}
                    onNavigateHome={() => navigate('/')}
                    onNavigateEvents={() => navigate('/events')}
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    <div className="space-y-6">
                        <EventImage event={event} />
                        <EventInfo event={event} />
                        <EventActionButton
                            event={event}
                            loadingStates={loadingStates}
                            onAction={handleEventAction}
                        />
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                {eventDetails?.name}
                            </h1>
                            {eventDetails?.description && (
                                <div
                                    className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
                                    dangerouslySetInnerHTML={{ __html: eventDetails?.description }}
                                />
                            )}
                        </div>

                        <EventTabContent
                            event={event}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                        />
                    </div>
                </div>

                {similarTypeEvents && similarTypeEvents.length > 0 && (
                    <div className="mb-16">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                            Similar Type Events
                        </h2>
                        <SimilarEvents
                            events={similarTypeEvents}
                            loadingStates={loadingStates}
                            onAction={handleEventAction}
                            onNavigate={(id) => navigate(`/events/${id}`)}
                        />
                    </div>
                )}

                {similarCategoryEvents && similarCategoryEvents.length > 0 && (
                    <div className="mb-16">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                            Similar Category Events
                        </h2>
                        <SimilarEvents
                            events={similarCategoryEvents}
                            loadingStates={loadingStates}
                            onAction={handleEventAction}
                            onNavigate={(id) => navigate(`/events/${id}`)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventDetails;