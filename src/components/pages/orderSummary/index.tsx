import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getOrderSummary } from "../../../api/query";

const OrderSummary = () => {
    const refrence = localStorage.getItem('orderRefrence')
    const [orderSummary, setorderSummary] = useState<string | null>(null);

    const { data } = useQuery(['getOrderSummary', refrence], () => getOrderSummary(refrence))

    useEffect(() => {
        // Retrieve the reference from local storage
        if(data?.data?.data){
            setorderSummary(data.data.data.data)
        }
        console.log(orderSummary);
        
    }, [data, orderSummary]);

    return (
        <div className="w-full h-[80vh] flex flex-col items-center justify-center">
            <h1>Order Summary</h1>

        </div>
    );
};

export default OrderSummary;
