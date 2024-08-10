import { useQuery } from "react-query";
import { useParams } from "react-router-dom"
import { getOneProduct } from "../../../api/query";
import { IProduct } from "../../../interface/ProductInterface";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Mousewheel, Pagination } from 'swiper/modules';
const Details = () => {
    const { id: productIdParam } = useParams<{ id?: any }>();
    const { data } = useQuery(['getoneproduct', productIdParam], () => getOneProduct(productIdParam), {})
    console.log(data?.data?.data?.data?.related_product);
    const relatedProduct = data?.data?.data?.data?.related_product
    const product = data?.data?.data?.data?.product?.[0];
    return (
        <div className="w-full h-full  mt-[20px] flex flex-col items-center">
            <div className="w-full flex gap-[10px] justify-center">
                <div className="w-[20%] bg-red-400 flex flex-col items-center p-[10px] gap-[10px]">
                    <div className='w-full h-[250px] flex items-center justify-center '>
                        <img src={product?.productImage} className='w-[100%] object-cover aspect-square ' />
                    </div>
                    <div className="flex w-full items-center gap-[10px]">
                        <img src={product?.merchant?.image} alt="" className="w-[50px] h-[50px] rounded-[100%] object-cover" />
                        <p className="h-[40px]">{product?.productName}</p>
                    </div>
                    <div>
                        <p>{product?.productDescription}</p>
                    </div>
                </div>
                <div className="w-[50%] h-[300px] bg-red-400">

                </div>
                <div className="w-[20%] h-[300px] bg-red-400">

                </div>
            </div>
            <div className="w-[100%] mt-[50px] h-[400px] mb-[200px] flex flex-col items-center gap-[20px]">
                <p className=" w-[90%] text-[20px]">Recommended Product</p>
                <div className="w-[100%] p-0 flex flex-wrap gap-[10px]">
                    <Swiper
                        direction='horizontal'
                        slidesPerView={4}
                        spaceBetween={30}
                        mousewheel={false}
                        modules={[Mousewheel, Pagination]}
                        className='w-[90%] '
                        style={{padding: '10px'}}
                        >
                        {relatedProduct?.map((i: IProduct) => (
                            <SwiperSlide key={i?._id} className='w-[150px] h-[300px] border  rounded-lg p-[10px] flex flex-col gap-[10px] max-[650px]:border-none max-[650px]:bg-slate-50 max-[650px]:w-[100%] max-[650px]:rounded-none '  >
                                <div className=' h-[250px] flex items-center justify-center mb-[10px]'>
                                    <img src={i?.productImage} className='w-[100%] object-cover aspect-square ' />
                                </div>
                                <span >
                                    <p className='text-[20px]'>{i?.productName?.slice(0, 50)}</p>
                                </span>
                                <span className='flex gap-[10px]'>
                                    <p className='text-[15px] line-through text-[lightgrey]'>₦{i?.productPrice}</p>
                                    <p className='text-[15px]'>₦{i?.paymentPrice}</p>
                                </span>
                                <span className='flex gap-[10px] text-[12px] '>
                                    <div dangerouslySetInnerHTML={{ __html: i?.productDescription?.slice(0, 30) }} />
                                </span>
                                <div className='w-[100%] flex flex-col'>
                                    <div className='flex items-center w-[100%] h-[50px]'>
                                        <button
                                            className='w-[40%] h-[30px] bg-[#FFC300] rounded-[8px] text-[15px]'

                                        >
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