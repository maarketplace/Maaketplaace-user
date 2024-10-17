import { useEffect, useState } from "react";

const OrderSummary = () => {
    const [orderReference, setOrderReference] = useState<string | null>(null);

    useEffect(() => {
        // Retrieve the reference from local storage
        const savedReference = localStorage.getItem("orderReference");
        setOrderReference(savedReference);
    }, []);

    return (
        <div className="w-full h-[80vh] flex flex-col items-center justify-center">
            <h1>Order Summary</h1>
            {orderReference ? (
                <p>Order Reference: {orderReference}</p>
            ) : (
                <p>No order reference found.</p>
            )}
        </div>
    );
};

export default OrderSummary;
