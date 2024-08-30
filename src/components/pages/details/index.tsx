import { useQuery } from "react-query";
import { useParams } from "react-router-dom"
import { getOneProduct } from "../../../api/query";
import { IProduct } from "../../../interface/ProductInterface";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Mousewheel, Pagination } from 'swiper/modules';
import { useEffect, useState } from "react";

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
            <div className="w-[90%] flex gap-[10px] max-[650px]:flex-col">
                <div className="w-[20%]  flex flex-col items-center p-[10px] gap-[10px] max-[650px]:w-full max-[650px]:mt-[40px]">
                    <div className='w-full h-[250px] flex items-center justify-center '>
                        <img src={product?.productImage} className='w-[100%] object-cover aspect-square max-[650px]:h-[90%] ' />
                    </div>
                    <div className="flex w-full items-center gap-[10px] mt-[10px]">
                        <img src={product?.merchant?.image} alt="" className="w-[50px] h-[50px] rounded-[100%] object-cover" />
                        <p className=" text-[12px]">{product?.productName}</p>
                    </div>
                    <div>
                    {/* <p>{product?.productDescription}</p> */}
                    </div>
                </div>
                <div className="w-[50%] bg-slate-50 max-[650px]:w-full">
                    <div className='prose flex flex-wrap' dangerouslySetInnerHTML={{ __html: product?.productDescription }} />
                </div>
                {/* <div className="w-[20%] h-[300px] bg-slate-50 max-[650px]:w-full">
                    <span className="flex justify-between">
                        <p></p>
                    </span>
                    <span>

                    </span>
                    <span>

                    </span>
                    <button>Confirm</button>
                </div> */}
            </div>
            <div className="w-[100%] mt-[50px] h-[400px] mb-[200px] flex flex-col items-center gap-[20px]">
                <p className=" w-[90%] text-[20px]">Recommended Product</p>
                <div className="w-[100%] p-0 flex flex-wrap gap-[10px] max-[650px]:w-full ">
                    <Swiper
                        direction="horizontal"
                        spaceBetween={30}
                        mousewheel={false}
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
                                className="h-[450px] border rounded-lg p-[10px] flex flex-col gap-[20px] max-[650px]:border-none max-[650px]:bg-slate-50 max-[650px]:w-[100%] max-[650px]:rounded-none "
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