import { useQuery } from "react-query";
import { useParams } from "react-router-dom"
import { getOneProduct } from "../../../api/query";
import { IProduct } from "../../../interface/ProductInterface";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Mousewheel, Pagination } from 'swiper/modules';
import { useEffect, useState } from "react";
import { FiUser } from "react-icons/fi";
import { IoMdTime } from "react-icons/io";
import { RiPagesLine } from "react-icons/ri";
import { BsDot } from "react-icons/bs";

const Details = () => {
    const { id: productIdParam } = useParams<{ id?: any }>();
    const [product, setProduct] = useState<IProduct | null>(null)
    const { data } = useQuery(['getoneproduct', productIdParam], () => getOneProduct(productIdParam), {})


    const relatedProduct = data?.data?.data?.data?.related_product
    useEffect(() => {
        setProduct(data?.data?.data?.data?.product?.[0])
        // console.log(product);
    }, [data])

    return (
        <div className="w-full h-full text-[15px] mt-[100px] flex flex-col items-center max-[650px]:mt-[40px]">
            <div className="w-[90%] flex gap-[10px] max-[650px]:flex-col max-[650px]:w-[100%]">
                <div className="w-[20%]  flex flex-col items-center p-[10px] gap-[10px] max-[650px]:w-full max-[650px]:mt-[40px]">
                    <div className='w-full h-[250px] flex items-center justify-center '>
                        <img src={product?.productImage} className='w-[100%] object-cover aspect-square max-[650px]:h-[90%] ' />
                    </div>
                    <div className="flex w-full items-center gap-[10px] mt-[10px]">
                        <span className="w-[20%]">
                            <img src={product?.merchant?.image} alt="" className="w-[40px] h-[40px] rounded-full object-cover" />
                        </span>
                        <p className=" w-[50%] text-[12px]">{product?.productName.slice(0, 30)}</p>
                    </div>
                    {product?.pages ? (
                        <div className='h-[50%] max-[650px]:mt-[20px] max-[650px]:text-[14px]  max-[650px]:h-auto flex flex-col gap-3 justify-center max-[650px]:w-full'>
                            <span className='flex items-center gap-2'>
                                <BsDot className="text-[#FFC300] text-[30px]" />
                                <RiPagesLine />
                                <p>Pages: {product?.pages}</p>
                            </span>
                            <span className='flex items-center gap-2'>
                                <BsDot className="text-[#FFC300] text-[30px]" />
                                <IoMdTime />
                                <p>Duration: {product?.duration}</p>
                                <BsDot className="text-[#FFC300] text-[30px]" />
                            </span>
                            <span className='flex items-center gap-2'>
                                <FiUser />
                                <p>Author: {product?.author}</p>
                            </span>
                        </div>
                    ) : (
                        <div className='h-[50%]  max-[650px]:h-auto gap-2 flex flex-col justify-center max-[650px]:w-full'>
                            <span className='flex items-center gap-2'>
                                <BsDot className="text-[#FFC300] text-[30px]" />
                                <IoMdTime />
                                <p>Duration: {product?.duration}</p>
                            </span>
                            <span className='flex items-center gap-2'>
                                <BsDot className="text-[#FFC300] text-[30px]" />
                                <FiUser />
                                <p>Author: {product?.author}</p>
                            </span>
                            <span className='flex items-center gap-2'>
                                <BsDot className="text-[#FFC300] text-[30px]" />
                                {/* <FiUser /> */}
                                <p>Learn at your own pace</p>
                            </span>
                        </div>
                    )}
                    <div className="w-[90%]">
                        <button className=" bg-[#FFC300] w-[100%] text-[12px] h-[40px] rounded">
                            Pay for this course
                        </button>
                    </div>
                </div>
                <div className="w-[50%]  max-[650px]:w-[100%] dark:bg-black  p-[20px] flex flex-col gap-[20px]">
                    <div className="w-full">
                        <p className=" w-[100%] text-[20px]">{product?.productName}</p>
                        <div className='prose text-[14px] flex flex-wrap text-black dark:text-white max-[650px]:text-[14px]' dangerouslySetInnerHTML={{ __html: product?.productDescription }} />
                    </div>
                    <div className="w-full bg-slate-50 p-[20px] ">
                        <p className="text-[20px] max-[650px]:text-[16px]">In This Course, You Will Learn How To</p>
                        <div className='prose flex flex-wrap dark:text-white max-[650px]:text-[14px] mt-[20px] ' dangerouslySetInnerHTML={{ __html: product?.whatToExpect }} />
                    </div>
                </div>
            </div>
            <div className="w-[100%] mt-[50px] h-[400px] mb-[200px] flex flex-col items-center gap-[20px] ">
                <p className=" w-[90%] text-[20px]">Recommended Product</p>
                <div className="w-[100%] p-0 flex flex-wrap gap-[10px] max-[650px]:w-full ">
                    <Swiper
                        direction="horizontal"
                        spaceBetween={30}
                        mousewheel={true}
                        modules={[Mousewheel, Pagination]}
                        className="w-[90%]"
                        style={{ padding: "10px", }}
                        breakpoints={{
                            1024: {
                                slidesPerView: 4,
                                spaceBetween: 30,
                            },
                            768: {
                                slidesPerView: 2,
                                spaceBetween: 20,
                            },
                            650: {
                                slidesPerView: 1,
                                spaceBetween: 10,
                            },
                        }}
                    >
                        {relatedProduct?.map((i: IProduct) => (
                            <SwiperSlide
                                key={i?._id}
                                style={{ height: 400 }}
                                className="h-[450px] border rounded-lg p-[10px] flex flex-col gap-[20px] max-[650px]:border-none max-[650px]:bg-slate-50 dark:bg-black dark:shadow-sm dark:shadow-[lightgrey] max-[650px]:w-[100%] max-[650px]:rounded-none "
                            >
                                <div className="h-[250px] flex items-center justify-center mb-[10px] max-[650px]:w-full max-[650px]:h-[250px]">
                                    <img
                                        src={i?.productImage}
                                        className="w-[100%] h-[100%] "
                                    />
                                </div>
                                <span className="">
                                    <p className="text-[15px]" >{i?.productName?.slice(0, 50)}</p>
                                </span>
                                <span className="flex gap-[10px]">
                                    <p className="text-[15px] line-through text-[lightgrey]">
                                        ₦{i?.productPrice}
                                    </p>
                                    <p className="text-[15px]">₦{i?.paymentPrice}</p>
                                </span>
                                <span className="flex gap-[10px] text-[12px]">
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: i?.productDescription?.slice(0, 30),
                                        }}
                                    />
                                </span>
                                <div className="w-[100%] flex flex-col">
                                    <div className="flex items-center w-[100%] h-[50px]">
                                        <button className="w-[40%] h-[30px] bg-[#FFC300] rounded-[8px] text-[15px]">
                                            Buy Now
                                        </button>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                </div>
            </div>
        </div>
    )
}

export default Details