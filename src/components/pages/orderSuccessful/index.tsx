import { useEffect } from "react";

const OrderSuccess = () => {
    useEffect(() => {
        // Get the full current URL
        const currentUrl = window.location.href;

        // Extract the part of the URL after the hash
        const hashIndex = currentUrl.indexOf("#");
        if (hashIndex !== -1) {
            // Get the part after the hash
            const urlAfterHash = currentUrl.substring(hashIndex + 1);

            // Create a URLSearchParams object with the part after the hash
            const urlParams = new URLSearchParams(urlAfterHash.split("?")[1]);

            // Get the 'reference' query parameter from the URL
            const reference = urlParams.get("reference");

            // If the reference exists, save it to local storage
            if (reference) {
                console.log("Reference found:", reference); // Debugging log
                localStorage.setItem("orderReference", reference);
            } else {
                console.log("Reference not found in the URL."); // Debugging log
            }
        }
    }, []);

    return (
        <div className="w-full h-[80vh] flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold">Order Successful!</h1>
            <p className="text-center">Thank you for your purchase. Your order has been placed successfully.</p>
        </div>
    );
};

export default OrderSuccess;
