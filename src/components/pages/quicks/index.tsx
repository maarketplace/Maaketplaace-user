import { useEffect, useRef, useState } from "react";
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
// import { useAuth } from "../../../context/Auth";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from 'react-router-dom';
import SwiperCore from 'swiper';
import { Drawer } from "@mui/material";
// import Comment from "../comment";
import { userBuyNow, userPayWithKora } from "../../../api/mutation";
import { handleBuyNow, handlePayNow } from "../../../utils/PaymentComponent";
import PaymentModal from "../../../utils/PaymentModal";
import Loading from "../../../loader";
import QuciksComment from "./quicksComment";

const isVideoFile = (fileUrl: string) => {
    const videoExtensions = [".mp4", ".mov", ".avi", ".webm"];
    return videoExtensions.some(extension => fileUrl.endsWith(extension));
};
const Quicks = () => {
    const navigate = useNavigate();
    const iframeRef = useRef(null);
    const [allProduct, setAllProduct] = useState<IQuicks[]>([]);
    const { data } = useUser();
    const queryClient = useQueryClient();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [currentProductId, setCurrentProductId] = useState<string | null>(null);
    const location = useLocation();
    const [touchStartY, setTouchStartY] = useState<number>(0);
    const [touchEndY, setTouchEndY] = useState<number>(0);
    const [activeSlideIndex, setActiveSlideIndex] = useState(0);
    const swiperRef = useRef<SwiperCore>();
    const videoRefs = useRef<HTMLVideoElement[]>([]);
    const [isPlaying, setIsPlaying] = useState<boolean[]>(new Array(allProduct.length).fill(false));
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [paymentDetails, setPaymentDetails] = useState(
        {
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
    // const { isUserAuthenticated } = useAuth();
    const loggedInUserId = data?._id;
    const {
        data: allQuicksData, isLoading
    } = useQuery(["getAllQuciks"], getAllQuciks);

    useEffect(() => {
        if (allQuicksData && allQuicksData?.data && allQuicksData?.data?.data?.data) {
            const reversedData = [...allQuicksData.data.data.data]?.reverse();
            setAllProduct(reversedData);
        }
        console.log(allQuicksData);

    }, [allQuicksData]);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const sharedReelId = searchParams.get("reelId");

        if (sharedReelId && allProduct.length > 0) {
            const index = allProduct.findIndex(product => product._id === sharedReelId);
            if (index !== -1) {
                swiperRef.current?.slideTo(index, 0);
            }
        }
    }, [location.search, allProduct]);

    const { mutate } = useMutation(userLikeAQuicks, {
        onSuccess: () => {
            queryClient.invalidateQueries('getAllQuciks');
        },
        onError: (err) => {
            console.log('Error:', err);
        },
    });
    const { mutate: buyMutate } = useMutation(['buynow'], userBuyNow,);

    const handleCartAddingAuth = (id: string) => {
        handleBuyNow(id, setLoadingStates, setPaymentDetails, setIsModalOpen, buyMutate);
    };

    const { mutate: payNowMutate } = useMutation(['paynow'], userPayWithKora);

    const handlePayment = (paymentID: string) => {
        handlePayNow(payNowMutate, paymentID, setPaymentDetails, setIsModalOpen);
    };
    const handleCheckout = () => {
        if (iframeRef.current) {
            console.log('Setting iframe src to:', paymentDetails.checkoutURL);
            iframeRef.current.style.display = 'block';
            iframeRef.current.src = paymentDetails.checkoutURL;
        }
    };
    useEffect(() => {
        if (!paymentDetails.checkoutURL) {
            console.log("Checkout URL is not set yet.");
            return;
        }
        console.log("Checkout URL is set");

        const handleResponse = (event: { origin: string; data: string }) => {
            if (event.origin === new URL(paymentDetails.checkoutURL).origin) {
                const parsedData = JSON.parse(event.data);
                const paymentData = parsedData.data;
                if (paymentData && paymentData.reference) {
                    localStorage.setItem('orderRefrence', paymentData.reference);
                }
                const result = parsedData.result;
                switch (result) {
                    case 'success':
                        console.log('Payment successful, redirecting to success page...');
                        navigate('/home/order-success')
                        break;

                    case 'failed':
                        navigate('/home/order-failure')
                        break;

                    case 'pending':

                        break;

                    default:
                        console.log('Unknown result, handling default case...');
                        // Optional: Handle default case or stay on the current page
                        break;
                }

            }

        };
        window.addEventListener('message', handleResponse);

        // Cleanup the event listener when the component unmounts
        return () => {
            window.removeEventListener('message', handleResponse);
        };
    }, [navigate, paymentDetails.checkoutURL, setIsModalOpen]);
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const handleLikeClick = async (productId: string) => {
        const updateLikeProduct = [...allProduct];
        const existingItem = updateLikeProduct.findIndex(product => product._id === productId);
        if (existingItem !== -1) {
            if (!updateLikeProduct[existingItem].user_likes.includes(loggedInUserId)) {
                updateLikeProduct[existingItem].total_likes += 1;
                updateLikeProduct[existingItem].user_likes.push(loggedInUserId);
            } else {
                updateLikeProduct[existingItem].total_likes -= 1;
                updateLikeProduct[existingItem].user_likes = updateLikeProduct[existingItem].user_likes.filter((id: string) => id !== loggedInUserId);
            }
            setAllProduct(updateLikeProduct);
            mutate(productId);
        }
    };

    const copyToClipboard = (reelId: string) => {
        const shareUrl = `http://maarketplaace.com/#/home/quicks?reelId=${reelId}`;
        navigator.clipboard.writeText(shareUrl).then(() => {
            toast.success('Link copied successfully!');
        });
    };

    const toggleDrawer = (open: boolean, productId: string | null = null) => {
        setDrawerOpen(open);
        setCurrentProductId(productId);
        console.log(productId);

    };
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEndY(e.touches[0].clientY);
    };

    const handleTouchEnd = () => {
        if (touchEndY - touchStartY > 150) {
            setDrawerOpen(false);
        }
    };
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    const video = entry.target as HTMLVideoElement;
                    if (entry.isIntersecting) {
                        video.play();
                    } else {
                        video.pause();
                    }
                });
            },
            { threshold: 0.5 }
        );

        videoRefs.current.forEach(video => {
            if (video) observer.observe(video);
        });

        return () => observer.disconnect();
    }, [allProduct]);

    const handleSlideChange = (swiper: SwiperCore) => {
        setActiveSlideIndex(swiper.activeIndex);
    };

    const handleOverlayClick = (index: number) => {
        const videoElement = videoRefs.current[index];
        if (videoElement) {
            if (isPlaying[index]) {
                videoElement.pause();
            } else {
                videoElement.play();
            }
            // Toggle play/pause state for this video
            setIsPlaying((prev) => {
                const updatedIsPlaying = [...prev];
                updatedIsPlaying[index] = !prev[index];
                return updatedIsPlaying;
            });
        }
    };
    return (
        <div className="w-full h-full flex gap-[10px]">
            {isLoading ? (
                <div className="w-[100%] h-[80vh] flex items-center justify-center">
                    <p>Loading Quicks....</p>
                </div>
            ) : (
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
                        className="w-[100%] h-[100vh] max-[650px]:h-[90vh] max-[650px]:mb-[100px] max-[650px]:mt-[0px] "
                    >
                        {allProduct.map((i: IQuicks, index) => (
                            <SwiperSlide key={i._id} style={{ display: 'flex', height: '100%', gap: 20, justifyContent: 'center', overflow: 'hidden' }}>
                                <div className="w-[40%] max-[650px]:w-[100%] bg-black p-0">
                                    {isVideoFile(i.file) ? (
                                        <video
                                            ref={el => (videoRefs.current[index] = el!)}
                                            src={i.file}
                                            controls={false}
                                            loop={index === activeSlideIndex}
                                            className="relative w-full h-full object-cover max-[650px]:w-[100%]"
                                            muted={false}
                                        />
                                    ) : (
                                        <img
                                            src={i.file}
                                            alt=""
                                            className="relative w-full h-full object-cover max-[650px]:w-[100%]"
                                        />
                                    )}
                                    <div className="w-[100%] h-[100%] bg-[#00000038] opacity-90 flex items-end absolute inset-0" onClick={() => handleOverlayClick(index)}>
                                        <div className="w-[100%] max-[650px]:h-[400px] hidden max-[650px]:flex max-[650px]:flex-col max-[650px]:gap-[10px]">
                                            <div className="w-[100%] max-[650px]:h-[80%] flex justify-end">
                                                <div className="w-[20%] h-[100%] flex flex-col items-center justify-center gap-[10px]">
                                                    <span className="gap-[10px] w-[40px] flex items-center justify-center relative">
                                                    </span>
                                                    <span className="w-[40px] h-[40px] bg-[white] rounded-full flex items-center justify-center mt-[10px]">
                                                        {i?.user_likes && i?.user_likes.includes(loggedInUserId) ? (
                                                            <IoHeart size={23} className="text-[#FFc300] text-[25px]" onClick={() => handleLikeClick(i._id)} />
                                                        ) : (
                                                            <IoHeartOutline size={23} className="text-[black] text-[25px]" onClick={() => handleLikeClick(i._id)} />
                                                        )}
                                                    </span>
                                                    <p className="text-white text-lg font-bold shadow-md">{i?.total_likes}</p>
                                                    <span className="w-[40px] h-[40px] bg-[white] rounded-full flex items-center justify-center mt-[10px]" onClick={() => toggleDrawer(true, i?._id)}>
                                                        <FaRegComment className="text-[black] text-[25px]" />
                                                    </span>
                                                    <p className="text-white text-lg font-bold shadow-md">{i?.comments?.length}</p>
                                                    <span className="w-[40px] h-[40px] bg-[white] rounded-full flex items-center justify-center mt-[10px]" onClick={() => copyToClipboard(i._id)}>
                                                        <IoShareSocial className="text-[black] text-[25px]" />
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="w-[100%] max-[650px]:h-[40%] flex flex-col">
                                                <div className="w-[90%] max-[650px]:w-full p-1 h-[40%] flex  items-center  justify-between">
                                                    <span className="flex items-center gap-[10px] w-[60%]">
                                                        {!i?.merchant_id?.image ? <FaUser className="w-[30px] h-[30px] rounded-full object-cover" /> : <img src={i.merchant_id?.image} alt="MerchantImage" className="w-[30px] h-[30px] rounded-full object-cover aspect-square" />}
                                                        <p className="text-white text-[14px] font-bold shadow-md truncate">{i.merchant_id?.business_name || i.merchant_id?.fullName}</p>
                                                    </span>
                                                    <button className=" bg-[#FFC300] text-black text-[12px] h-[25px] px-2 rounded" onClick={() => handleCartAddingAuth(i?.product_id?._id)}>
                                                        {loadingStates[i?._id] ? <Loading /> : 'Buy Now'}
                                                    </button>
                                                </div>
                                                <span className="ml-[20px] mt-[10px] text-[12px]">
                                                    <p className="text-white">{i?.description.slice(0, 120)}</p>
                                                </span>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div className="w-[40%] h-[100%] bg mt-[20px] flex relative flex-col gap-[20px] max-[650px]:hidden">
                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-[10px]">
                                            <img src={i?.merchant_id?.image} alt="" className="w-[40px] h-[40px] rounded-[100%] object-cover" />
                                            <p>{i?.merchant_id?.business_name}</p>
                                        </span>
                                        <button>
                                            Follow
                                        </button>
                                    </div>
                                    <div className="flex flex-col gap-[10px]">
                                        <h2 className="text-[24px] font-bold">{i?.product_id?.productName}</h2>
                                        <div className="text-[16px]">{parse(i.description)}</div>
                                    </div>
                                    <div className=" w-[60%] flex items-center justify-between">
                                        <button onClick={() => handleLikeClick(i._id)} className="flex items-center gap-[5px]">
                                            {i.product_id?.user_likes && i.product_id?.user_likes.includes(loggedInUserId) ? (
                                                <IoHeart size={20} className="text-[#FFc300]" />
                                            ) : (
                                                <IoHeartOutline size={20} />
                                            )}
                                            <p>{i.product_id?.total_likes}</p>
                                        </button>
                                        <span className="flex items-center gap-[5px]" onClick={() => toggleDrawer(true, i._id)}>
                                            <FaRegComment size={20} />
                                            <p>{i?.comments?.length}</p>
                                        </span>
                                        <span onClick={() => copyToClipboard(i._id)} className="p-[8px] rounded-full">
                                            <IoShareSocial size={20} />
                                        </span>
                                    </div>
                                    {/* <div>
                                        <Comment productId={currentProductId} />
                                    </div> */}
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            )}
            {
                isModalOpen && (
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
                                        className="w-[70%] h-[30px] bg-[#FFC300] text-black rounded-[8px] text-[14px]"
                                        onClick={handleCheckout}
                                    >
                                        Pay Now
                                    </button>
                                ) : (
                                    <button className="w-[70%] h-[30px] bg-[#FFC300] text-black rounded-[8px] text-[14px]" onClick={() => handlePayment(paymentDetails.paymentID)}>
                                        Continue
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
                )
            }
            <Drawer
                anchor="bottom"
                className="h-[100vh] w-[100%]"
                open={drawerOpen}
                onClose={() => toggleDrawer(false)}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <QuciksComment quicksId={currentProductId} />
            </Drawer>
        </div>
    );
};

export default Quicks;