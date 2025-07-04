import { useQuery } from "react-query";
import { getAllQuciks } from "../../../api/query";
import { useState, useEffect } from "react";
import { IQuicks } from "../../../interface/ProductInterface";
import { useNavigate } from "react-router-dom";

const ProductReels = () => {
    const navigate = useNavigate();
    const [allProduct, setAllProduct] = useState<IQuicks[]>([]);
    const { data } = useQuery(["getAllQuciks"], getAllQuciks, {
        staleTime: 5 * 60 * 1000,
        cacheTime: 30 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
    });
    useEffect(() => {
        if (data?.data?.data?.data) {
            const reversedData = [...data.data.data.data].reverse();
            setAllProduct(reversedData);
        }
    }, [data]);

    return (
        <div className={`w-[100%] ${allProduct.length === 0 ? 'h-0' : 'h-[180px] mt-4'} max-[650px]:w-[100%] transition-height duration-300  border dark:border-gray-800 rounded-lg`}>
            <div className='w-[100%] h-[95%] flex gap-[20px] p-[10px] overflow-x-auto whitespace-nowrap no-scrollbar'>
                {allProduct.map((i) => (
                    <div key={i?._id} className="w-[150px] h-[150px] max-w-[150px] flex-shrink-0 inline-block" onClick={() => navigate(`/quicks?reelId=${i?._id}`)}>
                        <div className='w-[100%] relative flex items-center justify-center rounded-[10px]'>
                            <img src={i?.product_id?.productImage} alt="" className='w-[100%] h-[100%] object-cover aspect-square rounded-[10px]' />
                            <div className='absolute w-[100%] inset-0 bg-black bg-opacity-50 flex flex-col opacity-100 transition-opacity p-[10px] rounded-[8px]'>
                                <img src={i?.merchant_id?.image} alt="" className='w-[40px] h-[40px] rounded-full object-cover' />
                                <span className="h-[100px] flex items-end">
                                    <p className="text-[white] font-semibold ">{i?.merchant_id?.fullName?.slice(0, 15)}</p>
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductReels;
