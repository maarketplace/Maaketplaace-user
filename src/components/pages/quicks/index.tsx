import { useEffect, useState } from "react"
import { useQuery } from "react-query";
import { getAllProduct } from "../../../api/query";
import { IProduct } from "../../../interface/ProductInterface";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Mousewheel, Pagination } from 'swiper/modules';
import parse from 'html-react-parser';

const Quicks = () => {
    const [allProduct, setAllProduct] = useState<any>([])
    const {
        data: allProductData, isLoading
    } = useQuery(["getallproduct"], getAllProduct, {
        onSuccess: () => {
        },
        onError: () => {
        },
    });

    useEffect(() => {
        if (allProductData && allProductData?.data && allProductData?.data?.data) {
            // Reverse the order of the data array received from the API
            const reversedData = [...allProductData?.data?.data]?.reverse();
            setAllProduct(reversedData);
            console.log(reversedData);
        }
    }, []);

    return (
        <div className="w-full h-full flex gap-[10px] ">
            <div className="w-[100%] h-[100%] ">
                <Swiper
                    direction='vertical'
                    slidesPerView={1}
                    spaceBetween={30}
                    mousewheel={false}
                    modules={[Mousewheel, Pagination]}
                    className='w-[100%] h-[90vh]'>
                    {
                         isLoading ? 'Loading Quicks' : 
                        allProduct?.map((i: IProduct) => (
                            <SwiperSlide key={i?._id}  style={{display: 'flex', height: '80vh', gap: 20, justifyContent: 'center'}}>
                                <div className="w-[40%]" style={{ backgroundImage: `url(${i.productImage})`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', height: '88%' }} >
                                    <div className="bg-[#0000004f] w-[100%] h-[100%]">
                                    </div>
                                </div>
                                <div className="w-[40%] h-[100%]">
                                    <p>{i?.productName}</p>
                                    <p>{parse(i?.productDescription)}</p>
                                </div>
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
            </div>
        </div>
    )
}

export default Quicks