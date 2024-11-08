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
import { userLike } from "../../../api/mutation";
import { useUser } from "../../../context/GetUser";
// import { IoMdAdd } from "react-icons/io";
import toast from "react-hot-toast";
import { useLocation } from 'react-router-dom';
import SwiperCore from 'swiper';
import { Drawer } from "@mui/material";
import Comment from "../comment";

const isVideoFile = (fileUrl: string) => {
    const videoExtensions = [".mp4", ".mov", ".avi", ".webm"];
    return videoExtensions.some(extension => fileUrl.endsWith(extension));
};
const Quicks = () => {
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


    const loggedInUserId = data?._id;
    const {
        data: allQuicksData, isLoading
    } = useQuery(["getallproduct"], getAllQuciks);

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

    const { mutate } = useMutation(userLike, {
        onSuccess: () => {
            queryClient.invalidateQueries('getallproduct');
        },
        onError: (err) => {
            console.log('Error:', err);
        },
    });

    const handleLikeClick = async (productId: string) => {
        const updateLikeProduct = [...allProduct];
        const existingItem = updateLikeProduct.findIndex(product => product._id === productId);
        if (existingItem !== -1) {
            if (!updateLikeProduct[existingItem].product_id.user_likes.includes(loggedInUserId)) {
                updateLikeProduct[existingItem].product_id.total_likes += 1;
                updateLikeProduct[existingItem].product_id.user_likes.push(loggedInUserId);
            } else {
                updateLikeProduct[existingItem].product_id.total_likes -= 1;
                updateLikeProduct[existingItem].product_id.user_likes = updateLikeProduct[existingItem].product_id.user_likes.filter(id => id !== loggedInUserId);
            }
            setAllProduct(updateLikeProduct);
            mutate(productId);
        }
    };

    const copyToClipboard = (reelId: string) => {
        const shareUrl = `http://localhost:5174/#/home/quicks?reelId=${reelId}`;
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
                                <div className="w-[40%] max-[650px]:w-[100%] bg-black">
                                    {isVideoFile(i.file) ? (
                                        <video
                                            ref={el => (videoRefs.current[index] = el!)}
                                            src={i.file}
                                            controls={false}
                                            loop={index === activeSlideIndex}
                                            className="relative w-full h-full object-cover"
                                            muted={false}
                                        />
                                    ) : (
                                        <img
                                            src={i.file}
                                            alt=""
                                            className="relative w-full h-full object-cover"
                                        />
                                    )}
                                    <div className="w-[100%] h-[100%] bg-[#00000038] opacity-90 flex items-end absolute inset-0" onClick={() => handleOverlayClick(index)}>
                                        <div className="w-[100%] max-[650px]:h-[400px] hidden max-[650px]:flex max-[650px]:flex-col max-[650px]:gap-[10px]">
                                            <div className="w-[100%] max-[650px]:h-[75%] flex justify-end">
                                                <div className="w-[20%] h-[100%] flex flex-col items-center justify-center gap-[10px]">
                                                    <span className="gap-[10px] w-[40px] flex items-center justify-center relative">
                                                        {/* {!i?.merchant_id?.image ? <FaUser className="w-[30px] h-[30px] rounded-full object-cover" /> : <img src={i.merchant_id?.image} alt="MerchantImage" className="w-[40px] h-[40px] rounded-full object-cover" />} */}
                                                        {/* <span className="absolute top-7 w-[20px] h-[20px] bg-red-500 rounded-full flex items-center justify-center">
                                                            <IoMdAdd className="text-[15px]" />
                                                        </span> */}
                                                    </span>
                                                    <span className="w-[40px] h-[40px] bg-[white] rounded-full flex items-center justify-center mt-[10px]">
                                                        {i?.product_id?.user_likes && i?.product_id?.user_likes.includes(loggedInUserId) ? (
                                                            <IoHeart size={23} className="text-[#FFc300] text-[25px]" onClick={() => handleLikeClick(i._id)} />
                                                        ) : (
                                                            <IoHeartOutline size={23} className="text-[black] text-[25px]" onClick={() => handleLikeClick(i._id)} />
                                                        )}
                                                    </span>
                                                    <p className="text-white text-lg font-bold shadow-md">{i?.product_id?.total_likes}</p>
                                                    {/* <span className="w-[40px] h-[40px] bg-[white] rounded-full flex items-center justify-center mt-[10px]" onClick={() => toggleDrawer(true, i._id)}>
                                                        <FaRegComment className="text-[black] text-[25px]" />
                                                    </span> */}
                                                    {/* <p className="text-white text-lg font-bold shadow-md">{i?.product_id?.comments?.length}</p> */}
                                                    <span className="w-[40px] h-[40px] bg-[white] rounded-full flex items-center justify-center mt-[10px]" onClick={() => copyToClipboard(i._id)}>
                                                        <IoShareSocial className="text-[black] text-[25px]" />
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="w-[100%] max-[650px]:h-[40%] flex">
                                                <div className="w-[90%] h-[40%] flex ml-[10px]  justify-between">
                                                    <span className="flex items-center gap-[10px] w-[60%]">
                                                    {!i?.merchant_id?.image ? <FaUser className="w-[30px] h-[30px] rounded-full object-cover" /> : <img src={i.merchant_id?.image} alt="MerchantImage" className="w-[40px] h-[40px] rounded-full object-cover" />}
                                                        <p className="text-white text-[14px] font-bold shadow-md truncate">{i.merchant_id?.business_name || i.merchant_id?.fullName}</p>
                                                    </span>
                                                    <button
                                                        className="text-[12px]"
                                                        // onClick={}
                                                    >
                                                        Buy Now
                                                    </button>
                                                </div>
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
                                            <p>{i.product_id?.comments?.length}</p>
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

            <Drawer
                anchor="bottom"
                className="h-[100vh] w-[100%]"
                open={drawerOpen}
                onClose={() => toggleDrawer(false)}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {currentProductId && <Comment productId={currentProductId} />}
            </Drawer>
        </div>
    );
};

export default Quicks;
