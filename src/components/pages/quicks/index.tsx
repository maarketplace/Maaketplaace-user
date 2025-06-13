import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getAllQuciks } from "../../../api/query";
import { IQuicks } from "../../../interface/ProductInterface";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Mousewheel, Pagination } from 'swiper/modules';
import parse from 'html-react-parser';
import { IoHeart, IoHeartOutline, IoShareSocial } from "react-icons/io5";
import { FaRegComment, FaUser } from "react-icons/fa";
import { userLikeAQuicks } from "../../../api/mutation";
import { useUser } from "../../../context/GetUser";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from 'react-router-dom';
import SwiperCore from 'swiper';
import { Drawer } from "@mui/material";
import { userBuyNow, userPayWithKora } from "../../../api/mutation";
import { handleBuyNow, handlePayNow } from "../../../utils/PaymentComponent";
import PaymentModal from "../../../utils/PaymentModal";
import Loading from "../../../loader";
import QuciksComment from "./quicksComment";
import { useAuth } from "../../../context/Auth";

const isVideoFile = (fileUrl: string): boolean => {
    const videoExtensions = [".mp4", ".mov", ".avi", ".webm"];
    return videoExtensions.some(extension => fileUrl.toLowerCase().endsWith(extension));
};

// Skeleton loader component for better loading UX
const QuicksSkeleton = () => (
    <div className="w-full h-[100vh] flex items-center justify-center bg-gray-100 animate-pulse">
        <div className="w-[40%] max-[650px]:w-[100%] bg-gray-300 h-full rounded-lg"></div>
        <div className="w-[40%] max-[650px]:hidden h-full p-4 space-y-4">
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div className="h-4 bg-gray-300 rounded w-1/3"></div>
            </div>
            <div className="space-y-2">
                <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
            </div>
        </div>
    </div>
);

// Error boundary component
const ErrorDisplay = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
    <div className="w-full h-[80vh] flex flex-col items-center justify-center space-y-4">
        <p className="text-red-500 text-lg">{message}</p>
        <button
            onClick={onRetry}
            className="px-4 py-2 bg-[#FFC300] text-black rounded-lg hover:bg-[#e6b000] transition-colors"
        >
            Try Again
        </button>
    </div>
);

const Quicks = () => {
    const navigate = useNavigate();
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [allProduct, setAllProduct] = useState<IQuicks[]>([]);
    const { user } = useUser();
    const queryClient = useQueryClient();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [currentProductId, setCurrentProductId] = useState<string | null>(null);
    const location = useLocation();
    const [activeSlideIndex, setActiveSlideIndex] = useState(0);
    const swiperRef = useRef<SwiperCore>();
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
    const [isPlaying, setIsPlaying] = useState<boolean[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [paymentDetails, setPaymentDetails] = useState({
        amount: '',
        fee: '',
        paymentID: '',
        paymentAPI: '',
        payeeName: '',
        payeeEmail: '',
        checkoutURL: '',
        source: '',
    });
    const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
    const [payLoadingState, setPayLoadingStates] = useState<Record<string, boolean>>({});
    const [error, setError] = useState<string | null>(null);

    const { isUserAuthenticated } = useAuth();
    const loggedInUserId = user?._id;

    const {
        data: allQuicksData,
        isLoading,
        error: queryError,
        refetch
    } = useQuery(["getAllQuciks"], getAllQuciks, {
        retry: 3,
        retryDelay: 1000,
        onError: (err) => {
            setError("Failed to load content. Please try again.");
            console.error("Query error:", err);
        }
    });

    // Memoize processed data to avoid unnecessary re-renders
    const processedProducts = useMemo(() => {
        if (!allQuicksData?.data?.data?.data) return [];
        return [...allQuicksData.data.data.data].reverse();
    }, [allQuicksData]);

    useEffect(() => {
        setAllProduct(processedProducts);
        setIsPlaying(new Array(processedProducts.length).fill(false));
        videoRefs.current = new Array(processedProducts.length).fill(null);
    }, [processedProducts]);

    // Handle shared reel navigation
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const sharedReelId = searchParams.get("reelId");

        if (sharedReelId && allProduct.length > 0) {
            const index = allProduct.findIndex(product => product._id === sharedReelId);
            if (index !== -1) {
                swiperRef.current?.slideTo(index, 0);
                setActiveSlideIndex(index);
            }
        }
    }, [location.search, allProduct]);

    // Optimized mutation handlers
    const { mutate: likeMutate } = useMutation(userLikeAQuicks, {
        onSuccess: () => {
            queryClient.invalidateQueries('getAllQuciks');
        },
        onError: (err) => {
            toast.error("Failed to update like. Please try again.");
            console.error('Like error:', err);
        },
    });

    const { mutate: buyMutate } = useMutation(['buynow'], userBuyNow, {
        onError: (err) => {
            toast.error("Purchase failed. Please try again.");
            console.error('Buy error:', err);
        }
    });

    const { mutate: payNowMutate } = useMutation(['paynow'], userPayWithKora, {
        onError: (err) => {
            toast.error("Payment failed. Please try again.");
            console.error('Payment error:', err);
        }
    });

    // Optimized like handler with immediate UI feedback
    const handleLikeClick = useCallback(async (productId: string) => {
        if (!loggedInUserId) {
            toast.error("Please login to like posts");
            return;
        }

        const updateLikeProduct = [...allProduct];
        const existingItem = updateLikeProduct.findIndex(product => product._id === productId);

        if (existingItem !== -1) {
            const product = updateLikeProduct[existingItem];
            const hasLiked = product.user_likes.includes(loggedInUserId);

            // Optimistic update
            if (!hasLiked) {
                product.total_likes += 1;
                product.user_likes.push(loggedInUserId);
            } else {
                product.total_likes -= 1;
                product.user_likes = product.user_likes.filter((id: string) => id !== loggedInUserId);
            }

            setAllProduct(updateLikeProduct);
            likeMutate(productId);
        }
    }, [allProduct, loggedInUserId, likeMutate]);

    // Optimized cart handler
    const handleCartAddingAuth = useCallback((id: string) => {
        if (!isUserAuthenticated) {
            toast.error("Please login to make purchases");
            navigate('/login');
            return;
        }
        handleBuyNow(id, isUserAuthenticated, setLoadingStates, setPaymentDetails, setIsModalOpen, buyMutate, navigate);
    }, [isUserAuthenticated, buyMutate, navigate]);

    // Payment handler
    const handlePayment = useCallback((paymentID: string) => {
        handlePayNow(payNowMutate, paymentID, setPaymentDetails, setIsModalOpen, setPayLoadingStates);
    }, [payNowMutate]);

    // Optimized share handler
    const copyToClipboard = useCallback(async (reelId: string) => {
        try {
            const shareUrl = `${window.location.origin}/quicks?reelId=${reelId}`;
            await navigator.clipboard.writeText(shareUrl);
            toast.success('Link copied successfully!');
        } catch (err) {
            toast.error('Failed to copy link');
            console.error('Copy error:', err);
        }
    }, []);

    // Drawer handlers
    const toggleDrawer = useCallback((open: boolean, productId: string | null = null) => {
        setDrawerOpen(open);
        setCurrentProductId(productId);
    }, []);

    // Touch handlers for drawer
    const [touchStartY, setTouchStartY] = useState<number>(0);
    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        setTouchStartY(e.touches[0].clientY);
    }, []);

    const handleTouchEnd = useCallback((e: React.TouchEvent) => {
        const touchEndY = e.changedTouches[0].clientY;
        if (touchEndY - touchStartY > 150) {
            setDrawerOpen(false);
        }
    }, [touchStartY]);

    // Improved video intersection observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const video = entry.target as HTMLVideoElement;
                    const index = parseInt(video.dataset.index || '0');

                    if (entry.isIntersecting && index === activeSlideIndex) {
                        video.play().catch(err => console.log('Video play failed:', err));
                        setIsPlaying(prev => {
                            const updated = [...prev];
                            updated[index] = true;
                            return updated;
                        });
                    } else {
                        video.pause();
                        setIsPlaying(prev => {
                            const updated = [...prev];
                            updated[index] = false;
                            return updated;
                        });
                    }
                });
            },
            { threshold: 0.7 }
        );

        videoRefs.current.forEach((video, index) => {
            if (video) {
                video.dataset.index = index.toString();
                observer.observe(video);
            }
        });

        return () => observer.disconnect();
    }, [allProduct, activeSlideIndex]);

    // Checkout handler
    const handleCheckout = useCallback(() => {
        if (paymentDetails.amount === '₦0') {
            navigate('/free-order-summary');
            return;
        }

        if (iframeRef.current && paymentDetails.checkoutURL) {
            iframeRef.current.style.display = 'block';
            iframeRef.current.src = paymentDetails.checkoutURL;
        }
    }, [paymentDetails, navigate]);

    // Payment response handler
    useEffect(() => {
        if (!paymentDetails.checkoutURL) return;

        const handleResponse = (event: MessageEvent) => {
            try {
                if (event.origin !== new URL(paymentDetails.checkoutURL).origin) return;

                const parsedData = JSON.parse(event.data);
                const paymentData = parsedData?.data;

                if (paymentData?.reference) {
                    localStorage.setItem('orderRefrence', paymentData.reference);
                }

                switch (parsedData.result) {
                    case 'success':
                        navigate('/order-success');
                        break;
                    case 'failed':
                        navigate('/order-failure');
                        break;
                    case 'pending':
                        toast.success('Payment is pending...');
                        break;
                    default:
                        console.log('Unknown payment result');
                }
            } catch (err) {
                console.error('Payment response parsing error:', err);
            }
        };

        window.addEventListener('message', handleResponse);
        return () => window.removeEventListener('message', handleResponse);
    }, [navigate, paymentDetails.checkoutURL]);

    // Video overlay click handler
    const handleOverlayClick = useCallback((index: number) => {
        const videoElement = videoRefs.current[index];
        if (!videoElement) return;

        if (isPlaying[index]) {
            videoElement.pause();
        } else {
            videoElement.play().catch(err => console.log('Video play failed:', err));
        }

        setIsPlaying(prev => {
            const updated = [...prev];
            updated[index] = !prev[index];
            return updated;
        });
    }, [isPlaying]);

    const handleSlideChange = useCallback((swiper: SwiperCore) => {
        setActiveSlideIndex(swiper.activeIndex);
    }, []);

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Error handling
    if (error || queryError) {
        return <ErrorDisplay message={error || "Something went wrong"} onRetry={refetch} />;
    }

    // Loading state
    if (isLoading) {
        return <QuicksSkeleton />;
    }

    // Empty state
    if (!allProduct.length) {
        return (
            <div className="w-full h-[80vh] flex flex-col items-center justify-center space-y-4">
                <p className="text-gray-500 text-lg">No content available</p>
                <button
                    onClick={() => refetch()}
                    className="px-4 py-2 bg-[#FFC300] text-black rounded-lg hover:bg-[#e6b000] transition-colors"
                >
                    Refresh
                </button>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex gap-[10px]">
            <div className="w-[100%] h-[100%]">
                <Swiper
                    direction="vertical"
                    slidesPerView={1}
                    spaceBetween={0}
                    mousewheel={true}
                    modules={[Mousewheel, Pagination]}
                    loop={true}
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                    }}
                    onSlideChange={handleSlideChange}
                    className="w-[100%] h-[100vh] max-[650px]:h-[90vh] max-[650px]:mb-[100px] max-[650px]:mt-[0px]"
                >
                    {allProduct.map((item: IQuicks, index) => (
                        <SwiperSlide
                            key={item._id}
                            style={{
                                display: 'flex',
                                height: '100%',
                                gap: 20,
                                justifyContent: 'center',
                                overflow: 'hidden'
                            }}
                        >
                            <div className="w-[40%] max-[650px]:w-[100%] bg-black p-0 relative">
                                {isVideoFile(item.file) ? (
                                    <video
                                        ref={el => (videoRefs.current[index] = el)}
                                        src={item.file}
                                        controls={false}
                                        loop={true}
                                        className="w-full h-full object-cover max-[650px]:w-[100%]"
                                        muted={false}
                                        playsInline
                                        preload="metadata"
                                        onLoadStart={() => console.log(`Video ${index} started loading`)}
                                        onError={(e) => console.error(`Video ${index} error:`, e)}
                                    />
                                ) : (
                                    <img
                                        src={item.file}
                                        alt={item.product_id?.productName || "Product image"}
                                        className="w-full h-full object-cover max-[650px]:w-[100%]"
                                        loading="lazy"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = '/fallback-image.jpg';
                                        }}
                                    />
                                )}

                                {/* Overlay with controls */}
                                <div
                                    className="w-[100%] h-[100%] bg-[#00000038] opacity-90 flex items-end absolute inset-0 cursor-pointer transition-opacity hover:opacity-100"
                                    onClick={() => handleOverlayClick(index)}
                                    role="button"
                                    tabIndex={0}
                                    aria-label={isPlaying[index] ? "Pause video" : "Play video"}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            handleOverlayClick(index);
                                        }
                                    }}
                                >
                                    {/* Mobile UI */}
                                    <div className="w-[100%] max-[650px]:h-[400px] hidden max-[650px]:flex max-[650px]:flex-col max-[650px]:gap-[10px]">
                                        <div className="w-[100%] max-[650px]:h-[80%] flex justify-end">
                                            <div className="w-[20%] h-[100%] flex flex-col items-center justify-center gap-[10px]">
                                                {/* Like button */}
                                                <button
                                                    className="w-[40px] h-[40px] bg-white rounded-full flex items-center justify-center mt-[10px] hover:bg-gray-100 transition-colors"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleLikeClick(item._id);
                                                    }}
                                                    aria-label={`${item?.user_likes?.includes(loggedInUserId ?? '') ? 'Unlike' : 'Like'} this post`}
                                                >
                                                    {item?.user_likes && loggedInUserId && item?.user_likes.includes(loggedInUserId) ? (
                                                        <IoHeart size={23} className="text-[#FFc300]" />
                                                    ) : (
                                                        <IoHeartOutline size={23} className="text-black" />
                                                    )}
                                                </button>
                                                <p className="text-white text-lg font-bold shadow-md">
                                                    {item?.total_likes || 0}
                                                </p>

                                                {/* Comment button */}
                                                <button
                                                    className="w-[40px] h-[40px] bg-white rounded-full flex items-center justify-center mt-[10px] hover:bg-gray-100 transition-colors"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleDrawer(true, item._id);
                                                    }}
                                                    aria-label="View comments"
                                                >
                                                    <FaRegComment className="text-black text-[25px]" />
                                                </button>
                                                <p className="text-white text-lg font-bold shadow-md">
                                                    {item?.comments?.length || 0}
                                                </p>

                                                {/* Share button */}
                                                <button
                                                    className="w-[40px] h-[40px] bg-white rounded-full flex items-center justify-center mt-[10px] hover:bg-gray-100 transition-colors"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        copyToClipboard(item._id);
                                                    }}
                                                    aria-label="Share this post"
                                                >
                                                    <IoShareSocial className="text-black text-[25px]" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Product info */}
                                        <div className="w-[100%] max-[650px]:h-[40%] flex flex-col">
                                            <div className="w-[90%] max-[650px]:w-full p-1 h-[40%] flex items-center justify-between">
                                                <span className="flex items-center gap-[10px] w-[60%]">
                                                    {!item?.merchant_id?.image ? (
                                                        <FaUser className="w-[30px] h-[30px] rounded-full object-cover" />
                                                    ) : (
                                                        <img
                                                            src={item.merchant_id?.image}
                                                            alt="Merchant"
                                                            className="w-[30px] h-[30px] rounded-full object-cover aspect-square"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).style.display = 'none';
                                                            }}
                                                        />
                                                    )}
                                                    <p className="text-white text-[14px] font-bold shadow-md truncate">
                                                        {item.merchant_id?.business_name || item.merchant_id?.fullName}
                                                    </p>
                                                </span>
                                                <button
                                                    className="bg-[#FFC300] text-black text-[12px] h-[25px] px-2 rounded hover:bg-[#e6b000] transition-colors disabled:opacity-50"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleCartAddingAuth(item?.product_id?._id);
                                                    }}
                                                    disabled={loadingStates[item?._id]}
                                                    aria-label="Buy this product"
                                                >
                                                    {loadingStates[item?._id] ? <Loading /> : 'Buy Now'}
                                                </button>
                                            </div>
                                            <div className="ml-[20px] mt-[10px] text-[12px]">
                                                <p className="text-white line-clamp-3">
                                                    {item?.description?.slice(0, 120)}
                                                    {item?.description?.length > 120 && '...'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Desktop sidebar */}
                            <div className="w-[40%] h-[100%] mt-[20px] flex flex-col gap-[20px] max-[650px]:hidden">
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-[10px]">
                                        <img
                                            src={item?.merchant_id?.image}
                                            alt="Merchant"
                                            className="w-[40px] h-[40px] rounded-full object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                            }}
                                        />
                                        <p className="font-medium">
                                            {item?.merchant_id?.business_name}
                                        </p>
                                    </span>
                                    <button className="px-4 py-1 bg-[#FFC300] text-black rounded hover:bg-[#e6b000] transition-colors">
                                        Follow
                                    </button>
                                </div>

                                <div className="flex flex-col gap-[10px]">
                                    <h2 className="text-[24px] font-bold">
                                        {item?.product_id?.productName}
                                    </h2>
                                    <div className="text-[16px] line-clamp-6">
                                        {parse(item.description)}
                                    </div>
                                </div>

                                <div className="w-[60%] flex items-center justify-between">
                                    <button
                                        onClick={() => handleLikeClick(item._id)}
                                        className="flex items-center gap-[5px] hover:opacity-80 transition-opacity"
                                        aria-label={`${item.user_likes?.includes(loggedInUserId ?? '') ? 'Unlike' : 'Like'} this post`}
                                    >
                                        {item.user_likes && loggedInUserId && item.user_likes.includes(loggedInUserId) ? (
                                            <IoHeart size={20} className="text-[#FFc300]" />
                                        ) : (
                                            <IoHeartOutline size={20} />
                                        )}
                                        <p>{item.total_likes || 0}</p>
                                    </button>

                                    <button
                                        className="flex items-center gap-[5px] hover:opacity-80 transition-opacity"
                                        onClick={() => toggleDrawer(true, item._id)}
                                        aria-label="View comments"
                                    >
                                        <FaRegComment size={20} />
                                        <p>{item?.comments?.length || 0}</p>
                                    </button>

                                    <button
                                        onClick={() => copyToClipboard(item._id)}
                                        className="p-[8px] rounded-full hover:bg-gray-100 transition-colors"
                                        aria-label="Share this post"
                                    >
                                        <IoShareSocial size={20} />
                                    </button>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* Payment Modal */}
            {isModalOpen && (
                <div className='w-full h-full bottom-2 fixed z-[10000000]'>
                    <iframe
                        ref={iframeRef}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100vh',
                            display: 'none',
                            zIndex: 1000000,
                            backgroundColor: 'white'
                        }}
                        title="Payment Checkout"
                    />
                    <PaymentModal
                        isOpen={isModalOpen}
                        setIsOpen={setIsModalOpen}
                        title={paymentDetails?.source === 'payNow' ? "Complete Your Payment" : "Proceed to Payment"}
                        amount={paymentDetails?.amount}
                        fee={paymentDetails?.source === 'buyNow' ? paymentDetails?.fee : ''}
                        paymentAPI={paymentDetails?.source === 'payNow' ? paymentDetails?.paymentAPI : ''}
                        payeeEmail={paymentDetails?.source === 'payNow' ? paymentDetails?.payeeEmail : ''}
                        payeeName={paymentDetails?.source === 'payNow' ? paymentDetails?.payeeName : ''}
                        primaryButton={{
                            text: paymentDetails?.source === 'payNow' ? (
                                <button
                                    className="w-[70%] h-[30px] bg-[#FFC300] text-black rounded-[8px] text-[14px] hover:bg-[#e6b000] transition-colors"
                                    onClick={handleCheckout}
                                >
                                    Pay Now
                                </button>
                            ) : (
                                <button
                                    className="w-[70%] h-[30px] bg-[#FFC300] text-black rounded-[8px] text-[14px] hover:bg-[#e6b000] transition-colors disabled:opacity-50"
                                    onClick={() => handlePayment(paymentDetails.paymentID)}
                                    disabled={payLoadingState[paymentDetails.paymentID]}
                                >
                                    {payLoadingState[paymentDetails.paymentID] ? <Loading /> : 'Continue'}
                                </button>
                            ),
                            display: true,
                            primary: true,
                        }}
                        secondaryButton={{
                            text: "Cancel",
                            onClick: () => setIsModalOpen(false),
                            display: true,
                            primary: true,
                        }}
                    />
                </div>
            )}

            {/* Comments Drawer */}
            <Drawer
                anchor="bottom"
                className="h-[100vh] w-[100%]"
                open={drawerOpen}
                onClose={() => toggleDrawer(false)}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <QuciksComment quicksId={currentProductId} />
            </Drawer>
        </div>
    );
};

export default Quicks;
