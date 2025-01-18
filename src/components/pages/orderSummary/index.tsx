import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getOrderSummary } from "../../../api/query";
import { capitalizeFirstLetter, formatNumber } from "../../../utils/Utils";
import { IOrderSummary } from "../../../interface/OrderSummaryInterface";
import { saveAs } from "file-saver";
import { IProduct } from "../../../interface/ProductInterface";
import toast from "react-hot-toast";
const OrderSummary = () => {

    const refrence = localStorage.getItem('orderRefrence')
    const [orderSummary, setorderSummary] = useState<IOrderSummary | null>(null);
    const [isDownloadLoading, setIsDownloadLoading] = useState<string | null>(null);
    const { data } = useQuery(['getOrderSummary', refrence], () => getOrderSummary(refrence))

    useEffect(() => {
        if (data?.data?.data) {
            setorderSummary(data?.data?.data?.data)
        }
    }, [data, orderSummary]);

    const product = orderSummary?.products[0]
    const user = orderSummary?.user_id
    const productType = orderSummary?.products[0]?.productType

    const downloadEbook = async (product: IProduct) => {
        if (product?.eBook) {
            setIsDownloadLoading(product._id);
            try {
                await saveAs(product.eBook, `${product.productName}.pdf`);
                toast.success('Download Successful');
            } catch (error) {
                toast.error("Failed to download the file.");
            } finally {
                setIsDownloadLoading(null);
            }
        } else {
            toast.error("File URL not available for download.");
        }
    };
    return (
        <div className="w-full h-[90vh] flex flex-col items-center justify-center gap-[20px] ">
            <div className="w-[95%] h-[40px] bg-[#FFC300] text-black flex items-center justify-center">
                <p className="text-center">{user?.fullName}</p>
            </div>
            <div className="w-[95%]">
                <p className="text-center text-[14px]">Hi {user?.fullName}, Thank you for your purchase </p>
            </div>
            <div className="w-[400px]  dark:bg-black bg-[#eeeded] p-[10px] max-[650px]:w-[100%] flex flex-col items-center gap-[20px] rounded-lg">
                <span className="flex w-full justify-between text-[12px] items-center">
                    <p>Product Name:</p>
                    <p >{product?.productName.slice(0, 30)}..</p>
                </span>
                <span className="flex w-full justify-between text-[12px]">
                    <p>Price:</p>
                    <p>{formatNumber(orderSummary?.payable_amount)}</p>
                </span>
                <span className="flex w-full justify-between text-[12px]">
                    <p>Status:</p>
                    <p>{orderSummary?.status ? capitalizeFirstLetter(orderSummary.status) : ''}</p>
                </span>
            </div>
            <div className="w-[95%] flex flex-col gap-2">
                <span className="flex gap-[10px]">
                    <img src={product?.productImage} alt="" className="w-[60px]" />
                    <p className="text-[12px]">{product?.productName}</p>
                </span>
                {
                    productType === 'course' ?
                        <button
                            className="w-[150px] h-[30px] text-[12px] mt-[10px] rounded bg-[#FFC300] text-black"
                        >
                            <a href={product?.courseUrl} className="" target="blank"> Access Course Link</a>
                        </button>
                        :
                        <button
                            onClick={() => product && downloadEbook(product)}
                            disabled={isDownloadLoading === product?._id} // Disable button if loading
                            className={`w-[100px] h-[30px] text-[12px] mt-[10px] rounded ${isDownloadLoading === product?._id
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-[#FFC300] text-black"
                                }`}
                        >
                            {isDownloadLoading === product?._id ? "Loading..." : "Download file"}
                        </button>
                }

            </div>
        </div>
    );
};

export default OrderSummary;
