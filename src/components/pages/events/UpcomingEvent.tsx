import { useQuery } from "react-query";
import { getAllEvents } from "../../../api/query";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IEvent } from ".";

const UpcomingEvents = () => {
    const navigate = useNavigate();
    const [allEvents, setAllEvents] = useState<IEvent[]>([]);

    const {
        data: eventData,
        isLoading,
        error
    } = useQuery(
        ['getAllUpcomingEvents'],
        () => getAllEvents(),
        {
            staleTime: 5 * 60 * 1000,
            cacheTime: 30 * 60 * 1000,
            refetchOnWindowFocus: false,
        }
    );


    useEffect(() => {
        const upcomingEvents = eventData?.data?.data?.data?.upcoming;
        if (upcomingEvents && Array.isArray(upcomingEvents)) {
            const reversedData = [...upcomingEvents].reverse();
            setAllEvents(reversedData);
        }
    }, [eventData]);

    if (isLoading) {
        <div className="w-full flex justify-center items-center p-4">
            <div className="animate-pulse flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gray-200 mb-2"></div>
                <div className="h-4 w-32 bg-gray-200 rounded mb-1"></div>
                <div className="h-3 w-24 bg-gray-100 rounded"></div>
            </div>
        </div>
    }

    if (error) {
        return <div>Error loading events</div>;
    }

    return (
        <div className={`w-[100%] ${allEvents.length === 0 ? 'h-0' : 'h-[180px] mt-4 '} max-[650px]:w-[100%] transition-height duration-300`}>
            {
                allEvents.length === 0 ? null : <p className="mt-4 mb-6 w-full text-lg text-[#ffc300] font-semibold">Upcoming Events</p>
            }
            <div className={`w-[100%] h-[95%] flex gap-[20px] p-[10px] mb-[40px] overflow-x-auto whitespace-nowrap no-scrollbar border border-gray-800 rounded-lg ${allEvents.length === 0 ? 'hidden' : 'block'}`}>
                {allEvents.map((i) => (
                    <div
                        key={i?._id}
                        className="w-[150px] h-[150px] max-w-[150px] flex-shrink-0 inline-block cursor-pointer"
                        onClick={() => navigate(`/event-details/${i?._id}`)}
                    >
                        <div className='w-[100%] relative flex items-center justify-center rounded-[10px]'>
                            <img
                                src={i?.bannerImage}
                                alt={i?.name || "Event"}
                                className='w-[100%] h-[100%] object-cover aspect-square rounded-[10px]'
                            />
                            <div className='absolute w-[100%] inset-0 bg-black bg-opacity-50 flex flex-col opacity-100 transition-opacity p-[10px] rounded-[8px]'>
                                <img
                                    src={i?.merchant?.image}
                                    alt={i?.merchant?.fullName || "Merchant"}
                                    className='w-[40px] h-[40px] rounded-full object-cover'
                                />
                                <span className="h-[100px] flex items-end">
                                    <p className="text-[white] font-semibold">
                                        {i?.merchant?.fullName?.slice(0, 15)}
                                    </p>
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UpcomingEvents;
