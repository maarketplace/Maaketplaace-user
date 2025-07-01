import { CiMoneyCheck1 } from "react-icons/ci";
import { FiCalendar, FiMapPin } from "react-icons/fi";
import { IoMdTime } from "react-icons/io";
import { IEvent } from ".";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


const EventGrid = ({ events, onEventView }: { events: IEvent[], onEventView: (event: IEvent) => void }) => {
    const navigate = useNavigate();
    const handleMerchantClick = (businessName: string) => {
        const formattedName = businessName.trim().replace(/\s+/g, "-");
        navigate(`/store/${formattedName}`);
      };
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-12">
            {events?.map((event) => (
                <div
                    key={event?._id}
                    className="bg-white dark:bg-black border border-gray-700 shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer overflow-hidden"
                    onClick={() => onEventView(event)}
                >
                    <div className="relative">
                        <img
                            src={event?.bannerImage}
                            alt={event?.name}
                            className="w-full h-[350px] md:h-[300px] object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-[#FFC300] text-black px-2 py-1 rounded-full text-xs font-semibold">
                            Ticket
                        </div>
                    </div>
                    <div
                        className="flex p-4 items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity flex-1"
                        onClick={() => handleMerchantClick(event?.merchant?.business_name)}
                    >
                        {event?.merchant?.image ? (
                            <img
                                src={event?.merchant?.image}
                                alt="Merchant"
                                className="w-8 h-8 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                                <FaUser className="text-gray-500 text-sm" />
                            </div>
                        )}
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                            {event?.merchant?.business_name?.slice(0, 20) || event?.merchant?.fullName}
                        </p>
                    </div>

                    <div className="p-4">
                        <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white line-clamp-2">
                            {event?.name}
                        </h3>

                        <div className="flex items-center gap-2 mb-2 text-sm text-gray-600 dark:text-gray-400">
                            <FiCalendar className="w-4 h-4" />
                            <span>{new Date(event?.startDate)?.toLocaleDateString()}</span>
                        </div>

                        <div className="flex items-center gap-2 mb-2 text-sm text-gray-600 dark:text-gray-400">
                            <IoMdTime className="w-4 h-4" />
                            <span>{event?.startDate}</span>
                        </div>

                        <div className="flex items-center gap-2 mb-3 text-sm text-gray-600 dark:text-gray-400">
                            <FiMapPin className="w-4 h-4" />
                            <span className="line-clamp-1">{event?.location}</span>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                            <div className="flex items-center gap-1">
                                <CiMoneyCheck1 className="w-4 h-4" />
                                <span className="font-semibold text-gray-900 dark:text-white">
                                   {event?.price}
                                </span>
                            </div>

                            <button className="bg-[#FFC300] hover:bg-[#E6AF00] text-black px-3 py-1 rounded-md text-sm font-medium transition-colors">
                                View Details
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
export default EventGrid;
