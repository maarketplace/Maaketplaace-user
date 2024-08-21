import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getAllProduct } from "../../../api/query";
import { IProduct } from "../../../interface/ProductInterface";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Mousewheel, Pagination } from 'swiper/modules';
import parse from 'html-react-parser';
import { IoHeart, IoHeartOutline, IoShareSocial } from "react-icons/io5";
import { FaRegComment, FaUser } from "react-icons/fa";
import { userLike } from "../../../api/mutation";
import { useUser } from "../../../context/GetUser";
import { IoMdAdd } from "react-icons/io";
import toast from "react-hot-toast";
import { useLocation } from 'react-router-dom';
import SwiperCore from 'swiper';

const Quicks = () => {
    const [allProduct, setAllProduct] = useState<IProduct[]>([]);
    const { data } = useUser();
    const queryClient = useQueryClient();

    const location = useLocation();
    const swiperRef = useRef<SwiperCore>();

    const loggedInUserId = data?._id;
    const {
        data: allProductData, isLoading
    } = useQuery(["getallproduct"], getAllProduct);

    useEffect(() => {
        if (allProductData && allProductData?.data && allProductData?.data?.data?.products) {
            const reversedData = [...allProductData?.data?.data?.products]?.reverse();
            setAllProduct(reversedData);
        }
    }, [allProductData]);

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
            if (!updateLikeProduct[existingItem].user_likes.includes(loggedInUserId)) {
                updateLikeProduct[existingItem].total_likes += 1;
                updateLikeProduct[existingItem].user_likes.push(loggedInUserId);
            } else {
                updateLikeProduct[existingItem].total_likes -= 1;
                updateLikeProduct[existingItem].user_likes = updateLikeProduct[existingItem].user_likes.filter(id => id !== loggedInUserId);
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
                        spaceBetween={5}
                        mousewheel={true}
                        modules={[Mousewheel, Pagination]}
                        loop={true}
                        onSwiper={(swiper) => {
                            swiperRef.current = swiper;
                        }}
                        className="w-[100%] h-[92vh] max-[650px]:h-[92vh] max-[650px]:mt-[0px]"
                    >
                        {allProduct.map((i: IProduct) => (
                            <SwiperSlide key={i._id} style={{ display: 'flex', height: '100%', gap: 20, justifyContent: 'center', overflow: 'hidden' }}>
                                <div className="w-[40%] max-[650px]:w-[100%] bg-black">
                                    <img src={i.productImage} alt="" className="relative mt-[20px] w-full h-full object-cover" />
                                    <div className="w-[100%] h-[100%] bg-[#00000038] opacity-100 flex items-end absolute top-0 left-0 right-0 bottom-0">
                                        <div className="w-[100%] max-[650px]:h-[400px] hidden max-[650px]:flex max-[650px]:flex-col max-[650px]:gap-[10px]">
                                            <div className="w-[100%] max-[650px]:h-[75%] flex justify-end">
                                                <div className="w-[20%] h-[100%] flex flex-col items-center justify-center gap-[10px]">
                                                    <span className="gap-[10px] w-[40px] flex items-center justify-center relative">
                                                        {!i.merchant?.image ? <FaUser className="w-[30px] h-[30px] rounded-full object-cover" /> : <img src={i.merchant?.image} alt="MerchantImage" className="w-[40px] h-[40px] rounded-full object-cover" />}
                                                        <span className="absolute top-7 w-[20px] h-[20px] bg-red-500 rounded-full flex items-center justify-center">
                                                            <IoMdAdd className="text-[15px]" />
                                                        </span>
                                                    </span>
                                                    <span className="w-[40px] h-[40px] bg-[white] rounded-full flex items-center justify-center mt-[10px]">
                                                        {i.user_likes && i.user_likes.includes(loggedInUserId) ? (
                                                            <IoHeart size={23} className="text-[#FFc300] text-[25px]" onClick={() => handleLikeClick(i._id)} />
                                                        ) : (
                                                            <IoHeartOutline size={23} className="text-[black] text-[25px]" onClick={() => handleLikeClick(i._id)} />
                                                        )}
                                                    </span>
                                                    <p className="text-white text-lg font-bold shadow-md">{i.total_likes}</p>
                                                    <span className="w-[40px] h-[40px] bg-[white] rounded-full flex items-center justify-center mt-[10px]">
                                                        <FaRegComment className="text-[black] text-[25px]" />
                                                    </span>
                                                    <p className="text-white text-lg font-bold shadow-md">{i.comments?.length}</p>
                                                    <span className="w-[40px] h-[40px] bg-[white] rounded-full flex items-center justify-center mt-[10px]" onClick={() => copyToClipboard(i._id)}>
                                                        <IoShareSocial className="text-[black] text-[25px]" />
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="w-[100%] max-[650px]:h-[40%] flex">
                                                <div className="w-[90%] h-[40%]flex ml-[10px]">
                                                    <span className="flex items-center gap-[10px] w-[100%]">
                                                        <p className="text-white text-lg font-bold shadow-md truncate">{i.merchant?.business_name || i.merchant?.fullName}</p>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-[40%] h-[100%] mt-[20px] flex relative flex-col gap-[20px] max-[650px]:hidden">
                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-[10px]">
                                            <img src={i.merchant?.image} alt="" className="w-[40px] h-[40px] rounded-[100%] object-cover" />
                                            <p>{i.merchant?.business_name}</p>
                                        </span>
                                        <button>
                                            Follow
                                        </button>
                                    </div>
                                    <div className="flex flex-col gap-[10px]">
                                        <h2 className="text-[24px] font-bold">{i?.productName}</h2>
                                        <div className="text-[16px]">{parse(i.productDescription)}</div>
                                    </div>
                                    <div className=" w-[60%] flex items-center justify-between">
                                        <button onClick={() => handleLikeClick(i._id)} className="flex items-center gap-[5px]">
                                            {i.user_likes && i.user_likes.includes(loggedInUserId) ? (
                                                <IoHeart size={20} className="text-[#FFc300]" />
                                            ) : (
                                                <IoHeartOutline size={20} />
                                            )}
                                            <p>{i.total_likes}</p>
                                        </button>
                                        <span className="flex items-center gap-[5px]">
                                            <FaRegComment size={20} />
                                            <p>{i.comments?.length}</p>
                                        </span>
                                        <span onClick={() => copyToClipboard(i._id)} className="p-[8px] rounded-full">
                                            <IoShareSocial size={20} />
                                        </span>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            )}
        </div>
    );
};

export default Quicks;
