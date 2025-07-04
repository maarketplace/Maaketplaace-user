import { useCallback, useContext, useEffect, useState } from 'react';
import { useInfiniteQuery, useQuery } from 'react-query';
import { getAllEvents, searchProduct } from '../../../api/query';
import { SearchContext } from '../../../context/Search';
import ProductSkeleton from '../../../loader/productSkeleton';
import { CiMoneyCheck1 } from 'react-icons/ci';
import { FiUser, FiCalendar, FiMapPin } from 'react-icons/fi';
import { IoMdTime } from 'react-icons/io';
import { FiChevronDown, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Modal from '../../../utils/ProductModal';
import EventGrid from './EventGrid';
import UpcomingEvents from './UpcomingEvent';

export interface IEvent {
    _id: string;
    id: string;
    name: string;
    description: string;
    bannerImage: string;
    startDate: string;
    endDate: string;
    location: string;
    price: string;
    eventType: 'public' | 'private';
    category: string;
    totalTickets: number;
    ticketsSold: number;
    remainingTickets: number;
    merchant: {
        _id: string;
        fullName: string;
        email: string;
        business_name: string;
        bio: string;
        profession: string;
        image: string;
        verified: boolean;
    };
    createdAt: string;
    updatedAt: string;
}
type ProductType = 'all' | 'ticket';
interface TabOption {
    key: ProductType;
    label: string;
    count?: number;
}
const Event = () => {
    const context = useContext(SearchContext);
    const navigate = useNavigate();
    const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<ProductType>('ticket');
    const LIMIT = 8;

    const { debouncedSearchQuery = '', isSearching = false, clearSearch = () => { } } = context || {};
    const hasSearchQuery = isSearching;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const {
        data: eventData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading: isLoadingEvents,
    } = useInfiniteQuery(
        ['getAllEvents'],
        ({ pageParam = 1 }) => getAllEvents({ page: pageParam, limit: LIMIT }),
        {
            getNextPageParam: (lastPage) => {
                const currentPage = lastPage?.data?.data?.page || 1;
                const totalPages = lastPage?.data?.data?.totalPages || 1;

                return currentPage < totalPages ? currentPage + 1 : undefined;
            },
            staleTime: 5 * 60 * 1000,
            cacheTime: 30 * 60 * 1000,
            refetchOnWindowFocus: false,
            enabled: !hasSearchQuery,
        }
    );

    const {
        data: searchData,
        isLoading: isLoadingSearch,
        error: searchError,
    } = useQuery(
        ['searchEvents', debouncedSearchQuery],
        () => searchProduct(1, 100, debouncedSearchQuery),
        {
            enabled: hasSearchQuery && !!debouncedSearchQuery.trim(),
            staleTime: 2 * 60 * 1000,
            cacheTime: 10 * 60 * 1000,
        }
    );

    const isLoading = hasSearchQuery ? isLoadingSearch : isLoadingEvents;
    const error = hasSearchQuery ? searchError : null;

    let allEvents: IEvent[] = [];
    if (hasSearchQuery) {
        allEvents = searchData?.data?.data?.Events?.filter((item: IEvent) => item.name) || [];
    } else {
        // Extract events from pages
        allEvents = eventData?.pages?.flatMap(page => {
            // Check for different possible structures
            const events = page?.data?.data?.Events ||
                page?.data?.data?.events ||
                (page?.data?.data?.data && (page?.data?.data?.data?.Events || page?.data?.data?.data?.events)) ||
                [];
            return events;
        }) || [];
    }

    const handleEventView = (event: IEvent) => {
        setSelectedEvent(event);
        setIsEventModalOpen(true);
    };

    const handleLoadMore = () => {
        if (hasNextPage && !isFetchingNextPage && !hasSearchQuery) {
            fetchNextPage();
        }
    };

    const totalPages = eventData?.pages?.[eventData.pages.length - 1]?.data?.data?.totalPages || 0;
    const currentPage = eventData?.pages?.[eventData.pages.length - 1]?.data?.data?.page || 1;

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);

            if (currentPage > 3) {
                pages.push('...');
            }

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                if (!pages.includes(i)) {
                    pages.push(i);
                }
            }

            if (currentPage < totalPages - 2) {
                pages.push('...');
            }

            if (totalPages > 1) {
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const handlePageClick = (pageNumber: number) => {
        const pagesToFetch = pageNumber - (eventData?.pages?.length || 0);
        if (pagesToFetch > 0) {
            for (let i = 0; i < pagesToFetch; i++) {
                if (hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            }
        }
    };

    const formatEventDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString();
        } catch (error) {
            return dateString;
        }
    };

    const formatEventTime = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleTimeString();
        } catch (error) {
            return dateString;
        }
    };

    const cleanDescription = (htmlDescription: string) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlDescription;
        return tempDiv.textContent || tempDiv.innerText || '';
    };
    const tabs: TabOption[] = [
        { key: 'all', label: 'All Products' },
        { key: 'ticket', label: 'Tickets' },
    ];
    const handleTabChange = useCallback((tabKey: ProductType) => {
        if (tabKey === 'ticket') {
            navigate('/events');
            return;
        }
        if (tabKey === 'all') {
            navigate('/');
            return;
        }
        setActiveTab(tabKey);
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br bg-white dark:bg-black p-4">
            <div className="max-w-7xl mx-auto mt-20">
                <div className="mt-20">
                    <div className="flex items-center justify-center">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-1 shadow-md border border-gray-200 dark:border-gray-700">
                            <div className="flex space-x-3" role="tablist" aria-label="Product type filter">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.key}
                                        onClick={() => handleTabChange(tab.key)}
                                        role="tab"
                                        aria-selected={activeTab === tab.key}
                                        aria-controls={`${tab.key}-panel`}
                                        className={`
                                            relative px-4 py-1 rounded-lg font-medium text-sm max-[650px]:text-xs transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#FFC300] focus:ring-offset-2
                                            ${activeTab === tab.key
                                                ? 'bg-[#FFC300] text-black shadow-md'
                                                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }
                                        `}
                                    >
                                        <span className="flex items-center gap-1">
                                            {tab.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <UpcomingEvents />
                {hasSearchQuery && (
                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Searching for events: <span className="font-semibold">"{debouncedSearchQuery}"</span>
                            <button
                                onClick={clearSearch}
                                className="ml-2 text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                            >
                                Clear
                            </button>
                        </p>
                    </div>
                )}

                {isLoading ? (
                    <ProductSkeleton />
                ) : error ? (
                    <div className="text-center py-20">
                        <p className="text-xl text-red-500">
                            {hasSearchQuery ? 'Error searching events.' : 'Error loading events.'} Please try again.
                        </p>
                    </div>
                ) : allEvents?.length !== 0 ? (
                    <>
                        
                        <EventGrid
                            events={allEvents}
                            onEventView={handleEventView}
                        />

                        {hasSearchQuery ? (
                            <div className="flex flex-col items-center py-8 gap-4">
                                <div className="text-center">
                                    <p className="text-lg text-gray-500 dark:text-gray-400">
                                        Found {allEvents.length} events
                                    </p>
                                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                                        for "{debouncedSearchQuery}"
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex md:hidden flex-col items-center py-8 gap-4">
                                    {hasNextPage && (
                                        <button
                                            onClick={handleLoadMore}
                                            disabled={isFetchingNextPage}
                                            className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#FFC300] hover:bg-[#E6AF00] disabled:bg-gray-300 disabled:cursor-not-allowed text-black font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
                                        >
                                            {isFetchingNextPage ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                                    Loading...
                                                </>
                                            ) : (
                                                <>
                                                    <FiChevronDown className="w-4 h-4" />
                                                    Load More
                                                </>
                                            )}
                                        </button>
                                    )}

                                    {!hasNextPage && allEvents.length > 0 && (
                                        <div className="text-center">
                                            <p className="text-lg text-gray-500 dark:text-gray-400">
                                                🎉 You've seen all events!
                                            </p>
                                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                                                Total: {allEvents.length} events
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="hidden md:flex flex-col items-center py-8 gap-4">
                                    {totalPages > 0 && (
                                        <div className="flex items-center gap-2">
                                            <button
                                                disabled={currentPage === 1}
                                                className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                            >
                                                <FiChevronLeft className="w-4 h-4" />
                                                Previous
                                            </button>

                                            <div className="flex items-center gap-1">
                                                {getPageNumbers().map((page, index) => {
                                                    if (page === '...') {
                                                        return (
                                                            <span
                                                                key={`ellipsis-${index}`}
                                                                className="px-3 py-2 text-gray-500 dark:text-gray-400"
                                                            >
                                                                ...
                                                            </span>
                                                        );
                                                    }

                                                    const pageNumber = page as number;
                                                    const isActive = pageNumber === currentPage;

                                                    return (
                                                        <button
                                                            key={pageNumber}
                                                            onClick={() => handlePageClick(pageNumber)}
                                                            disabled={pageNumber > currentPage && !hasNextPage}
                                                            className={`px-3 py-2 rounded-lg transition-colors duration-200 ${isActive
                                                                ? 'bg-[#FFC300] text-black font-medium'
                                                                : 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed'
                                                                }`}
                                                        >
                                                            {pageNumber}
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            <button
                                                onClick={handleLoadMore}
                                                disabled={!hasNextPage || isFetchingNextPage}
                                                className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                            >
                                                {isFetchingNextPage ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                                        Loading...
                                                    </>
                                                ) : (
                                                    <>
                                                        Next
                                                        <FiChevronRight className="w-4 h-4" />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    )}

                                    <div className="text-center">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Showing {allEvents.length} events
                                            {totalPages > 0 && ` • Page ${currentPage} of ${totalPages}`}
                                            {!hasNextPage && totalPages > 0 && " • All pages loaded"}
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-xl text-gray-500 dark:text-gray-400">
                            Oops  No events found
                        </p>
                        {hasSearchQuery && (
                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                                Try adjusting your search term: "{debouncedSearchQuery}"
                            </p>
                        )}
                    </div>
                )}
            </div>

            {isEventModalOpen && selectedEvent && (
                <Modal onClose={() => setIsEventModalOpen(false)}>
                    <div className="flex w-full gap-2 max-[650px]:flex-col max-[650px]:w-full overflow-auto no-scrollbar">
                        <span className="w-[50%] flex items-center justify-center max-[650px]:w-full no-scrollbar">
                            <img
                                src={selectedEvent.bannerImage}
                                alt={selectedEvent.name}
                                className="object-cover w-full aspect-square"
                            />
                        </span>
                        <div className="w-[50%] flex flex-col gap-2 max-[650px]:w-full mt-[20px]">
                            <div className="w-full h-[20%] gap-2 flex flex-col justify-end max-[650px]:h-auto">
                                <h2 className="text-[14px] mb-1 pb-2 flex items-center border-b border-lightgrey">
                                    Event Ticket
                                </h2>
                                <h2 className="text-[20px] w-full max-[650px]:text-[15px]">
                                    {selectedEvent?.name}
                                </h2>
                            </div>

                            <div className="prose h-[30%] max-[650px]:w-full max-[650px]:text-[12px] text-[#000000c1] dark:text-white text-[14px]">
                                <p>{cleanDescription(selectedEvent?.description)?.slice(0, 80)}...</p>
                            </div>

                            <div className="h-[50%] max-[650px]:mt-[20px] max-[650px]:text-[14px] max-[650px]:h-auto flex flex-col gap-3 justify-center max-[650px]:w-full">
                                <p>Event Details</p>
                                <span className="flex items-center gap-2">
                                    <FiCalendar />
                                    <p>Start Date: {formatEventDate(selectedEvent?.startDate)}</p>
                                </span>
                                <span className="flex items-center gap-2">
                                    <FiCalendar />
                                    <p>End Date: {formatEventDate(selectedEvent?.endDate)}</p>
                                </span>
                                <span className="flex items-center gap-2">
                                    <IoMdTime />
                                    <p>Start Time: {formatEventTime(selectedEvent?.startDate)}</p>
                                </span>
                                <span className="flex items-center gap-2">
                                    <FiMapPin />
                                    <p>Location: {selectedEvent?.location}</p>
                                </span>
                                <span className="flex items-center gap-2">
                                    <FiUser />
                                    <p>Organizer: {selectedEvent?.merchant?.business_name}</p>
                                </span>
                                <span className="flex items-center gap-2">
                                    <FiUser />
                                    <p>Available Tickets: {selectedEvent?.remainingTickets} / {selectedEvent?.totalTickets}</p>
                                </span>
                                <span className="flex items-center gap-2">
                                    <span className={`px-2 py-1 text-xs rounded ${selectedEvent?.eventType === 'public' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                        {selectedEvent?.eventType?.toUpperCase()}
                                    </span>
                                    <span className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-800">
                                        {selectedEvent?.category}
                                    </span>
                                </span>
                            </div>

                            <div className="flex w-full items-center justify-between mt-4">
                                <span className="flex gap-2 items-center">
                                    <CiMoneyCheck1 />
                                    <p>Price: {selectedEvent?.price}</p>
                                </span>
                                <button
                                    className="bg-[#FFC300] text-black w-[120px] text-[12px] h-[30px] rounded"
                                    onClick={() => navigate(`/event-details/${selectedEvent._id}`)}
                                >
                                    View  Ticket
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Event;
