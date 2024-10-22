import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getOrderSummary } from "../../../api/query";
import { capitalizeFirstLetter, formatNumber } from "../../../utils/CopytoClip";
import { IOrderSummary } from "../../../interface/OrderSummaryInterface";

const OrderSummary = () => {
    const refrence = localStorage.getItem('orderRefrence')
    const [orderSummary, setorderSummary] = useState<IOrderSummary | null>(null);

    const { data } = useQuery(['getOrderSummary', refrence], () => getOrderSummary(refrence))

    useEffect(() => {
        if (data?.data?.data) {
            setorderSummary(data.data.data.data)
        }
    }, [data, orderSummary]);

    const product = orderSummary?.products[0]
    return (
        <div className="w-full h-[90vh] flex flex-col items-center justify-center gap-2">
            <h1 className="font-semiBold text-[20px]">Order Summary</h1>
            <div className="w-[400px] h-[400px] bg-[#eeeded] p-[10px] max-[650px]:w-[95%] flex flex-col items-center gap-[20px] rounded-lg">
                <span className="flex w-full justify-between text-[14px]">
                    <p>Product Name:</p>
                    <p>{product?.productName}</p>
                </span>
                <span className="flex w-full justify-between text-[14px]">
                    <p>Price:</p>
                    <p>{formatNumber(product?.paymentPrice)}</p>
                </span>
                <span className="flex w-full justify-between text-[14px]">
                    <p>Price:</p>
                    <p>{formatNumber(orderSummary?.payable_amount)}</p>
                </span>
                <span className="flex w-full justify-between text-[14px]">
                    <p>Product Name:</p>
                    <p>{product?.productLocation}</p>
                </span>
                <span className="flex w-full justify-between text-[14px]">
                    <p>Image:</p>
                    <img src={product?.productImage} alt="" className="w-[60px]" />
                </span>

                <span className="flex w-full justify-between text-[14px]">
                    <p>Price:</p>
                    <p>{orderSummary?.status ? capitalizeFirstLetter(orderSummary.status) : ''}</p>
                </span>
            </div>
        </div>
    );
};

export default OrderSummary;
