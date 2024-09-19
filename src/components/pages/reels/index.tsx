import { useQuery } from "react-query";
import { getAllProduct } from "../../../api/query";
import { useEffect, useState } from "react";
import { IProduct } from "../../../interface/ProductInterface";

const ProductReels = () => {
    const [allProduct, setAllProduct] = useState<IProduct[]>([]);
    const { data } = useQuery(["getallproduct"], getAllProduct);

    useEffect(() => {
        if (data?.data?.data?.products) {
            const reversedData = [...data.data.data.products].reverse();
            setAllProduct(reversedData);
        }
    }, [data]);

    return (
        <div className='w-[100%] h-[180px]'>
            {/* Scrollable container */}
            <div className='w-[100%] h-[95%] flex gap-[20px] p-[10px] overflow-x-auto whitespace-nowrap'>
                {
                    allProduct.map((i) => (
                        <div className="w-[150px] h-[150px] max-w-[150px] flex-shrink-0 inline-block">
                            <div className='w-[100%] relative flex items-center justify-center rounded-[10px]'>
                                <img src={i.productImage} alt="" className='w-[100%] object-cover aspect-square rounded-[10px] ' />
                                <div className='absolute inset-0 bg-black bg-opacity-50 flex opacity-100 transition-opacity p-[10px] rounded-[8px]'>
                                    <img src={i.merchant.image} alt="" className='w-[40px] h-[40px] rounded-full object-cover' />
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
