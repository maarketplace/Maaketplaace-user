import { useQuery } from "react-query";
import { getAllProduct } from "../../../api/query";
import { useEffect, useState } from "react";
import { IProduct } from "../../../interface/ProductInterface";
import { useNavigate } from "react-router-dom";

const ProductReels = () => {
    const navigate = useNavigate()
    const [allProduct, setAllProduct] = useState<IProduct[]>([]);
    const { data } = useQuery(["getallproduct"], getAllProduct);

    useEffect(() => {
        if (data?.data?.data?.products) {
            const reversedData = [...data.data.data.products].reverse();
            setAllProduct(reversedData);
        }
    }, [data]);

    return (
        <div className='w-[95%] h-[180px] sticky top-0'>
            <div className='w-[100%] h-[95%] flex gap-[20px] p-[10px] overflow-x-auto whitespace-nowrap no-scrollbar'>
                {
                    allProduct.map((i) => (
                        <div className="w-[150px] h-[150px] max-w-[150px] flex-shrink-0 inline-block" onClick={()=>navigate(`/home/quicks?reelId=${i?._id}`)}>
                            <div className='w-[100%] relative flex items-center justify-center rounded-[10px]'>
                                <img src={i?.productImage} alt="" className='w-[100%] h-[100%] object-cover aspect-square rounded-[10px] ' />
                                <div className='absolute w-[100%] inset-0 bg-black bg-opacity-50 flex flex-col opacity-100 transition-opacity p-[10px] rounded-[8px]'>
                                    <img src={i?.merchant?.image} alt="" className='w-[40px] h-[40px] rounded-full object-cover' />
                                    <span className="h-[100px] flex items-end">
                                        <p className="text-[white] font-semibold ">{i?.merchant?.fullName?.slice(0,15)}</p>
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                }
                
            </div>
        </div>
    )
}

export default ProductReels;
