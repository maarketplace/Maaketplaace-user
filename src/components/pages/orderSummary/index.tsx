/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getOrderSummary } from "../../../api/query";
import { formatNumber } from "../../../utils/Utils";
import { IOrderSummary } from "../../../interface/OrderSummaryInterface";
import { saveAs } from "file-saver";
import toast from "react-hot-toast";

const OrderSummary = () => {
    const orderReference = localStorage.getItem('orderRefrence') || '';
    const [orderSummary, setOrderSummary] = useState<IOrderSummary | null>(null);
    const [isDownloadLoading, setIsDownloadLoading] = useState<string | null>(null);

    const { data, isLoading, isError } = useQuery(
        ['getOrderSummary', orderReference],
        () => getOrderSummary(orderReference),
        {
            enabled: !!orderReference,
            retry: 2,
        }
    );

    useEffect(() => {
        if (data?.data?.data) {
            setOrderSummary(data.data.data.data);
        }
    }, [data]);

    const user = orderSummary?.user_id;

    const getProductInfo = () => {
        if (!orderSummary) return null;

        if (orderSummary.referenceId?.eventId) {
            return {
                type: 'ticket' as const,
                data: {
                    name: orderSummary.referenceId.eventId.name,
                    image: orderSummary.referenceId.eventId.bannerImage,
                    startDate: orderSummary.referenceId.eventId.startDate,
                    endDate: orderSummary.referenceId.eventId.endDate,
                    location: orderSummary.referenceId.eventId.location,
                    attendees: orderSummary.referenceId.attendees,
                    ticketsSold: orderSummary.referenceId.eventId.ticketsSold,
                    totalTickets: orderSummary.referenceId.eventId.totalTickets,
                    remainingTickets: orderSummary.referenceId.eventId.remainingTickets
                }
            };
        }

        if (orderSummary.products && orderSummary.products.length > 0) {
            const product = orderSummary.products[0];

            if (product.productType === 'ebook') {
                return {
                    type: 'ebook' as const,
                    data: {
                        ...product,
                        name: product.productName,
                        image: product.productImage,
                        description: product.productDescription,
                        pages: product.pages,
                        eBookUrl: product.eBook,
                        subCategory: product.subCategory
                    }
                };
            } else if (product.productType === 'course') {
                return {
                    type: 'course' as const,
                    data: {
                        ...product,
                        name: product.productName,
                        image: product.productImage,
                        description: product.productDescription,
                        location: product.productLocation,
                        courseUrl: product.courseUrl
                    }
                };
            }
        }

        return null;
    };

    const productInfo = getProductInfo();

    const downloadEbook = async (product: any) => {
        if (!product?.eBookUrl) {
            toast.error("File URL not available for download.");
            return;
        }

        setIsDownloadLoading(product._id);
        try {
            await saveAs(product.eBookUrl, `${product.name}.pdf`);
            toast.success('Download Successful');
        } catch (error) {
            toast.error("Failed to download the file.");
            console.error("Download error:", error);
        } finally {
            setIsDownloadLoading(null);
        }
    };

    const renderProductAction = () => {
        if (!productInfo) return null;

        switch (productInfo.type) {
            case 'course':
                return (
                    <button
                        onClick={() => {
                            if (productInfo.data.courseUrl) {
                                window.open(productInfo.data.courseUrl, '_blank');
                            } else {
                                toast.error("Course URL not available.");
                            }
                        }}
                        className="w-[150px] h-[30px] text-[12px] mt-[10px] rounded bg-[#FFC300] text-black hover:bg-[#e6b000] transition-colors"
                    >
                        Access Course Link
                    </button>
                );
            case 'ebook':
                return (
                    <button
                        onClick={() => downloadEbook(productInfo.data)}
                        disabled={productInfo.data._id ? isDownloadLoading === productInfo.data._id : false}
                        className={`w-[100px] h-[30px] text-[12px] mt-[10px] rounded transition-colors
                            ${productInfo.data._id && isDownloadLoading === productInfo.data._id
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-[#FFC300] text-black hover:bg-[#e6b000]"
                            }`}
                    >
                        {productInfo.data._id && isDownloadLoading === productInfo.data._id ? "Loading..." : "Download file"}
                    </button>
                );
            case 'ticket':
                return (
                    <div className="text-[12px] mt-[10px]">
                        <p className="font-semibold">Event Details:</p>
                        <p>📅 {productInfo.data.startDate} - {productInfo.data.endDate}</p>
                        <p>📍 {productInfo.data.location}</p>
                        {productInfo.data.attendees && (
                            <p>👥 Attendees: {productInfo.data.attendees.join(', ')}</p>
                        )}
                        <p>🎫 Tickets Sold: {productInfo.data.ticketsSold}/{productInfo.data.totalTickets}</p>
                    </div>
                );
            default:
                return null;
        }
    };

    const renderProductDetails = () => {
        if (!productInfo) return null;

        const truncatedName = productInfo.data.name?.length > 30
            ? `${productInfo.data.name.slice(0, 30)}..`
            : productInfo.data.name;

        return (
            <span className="flex w-full justify-between text-[12px] items-center">
                <p>{productInfo.type === 'ticket' ? 'Event Name:' : 'Product Name:'}</p>
                <p>{truncatedName || 'N/A'}</p>
            </span>
        );
    };

    const renderAdditionalInfo = () => {
        if (!productInfo) return null;

        switch (productInfo.type) {
            case 'ebook':
                return (
                    <span className="flex w-full justify-between text-[12px]">
                        <p>Pages:</p>
                        <p>{productInfo.data.pages || 'N/A'}</p>
                    </span>
                );
            case 'course':
                return (
                    <span className="flex w-full justify-between text-[12px]">
                        <p>Platform:</p>
                        <p>{productInfo.data.location || 'N/A'}</p>
                    </span>
                );
            case 'ticket':
                return (
                    <span className="flex w-full justify-between text-[12px]">
                        <p>Remaining Tickets:</p>
                        <p>{productInfo.data.remainingTickets || 'N/A'}</p>
                    </span>
                );
            default:
                return null;
        }
    };

    if (isLoading) {
        return (
            <div className="w-full h-[90vh] flex items-center justify-center">
                <p>Loading order summary...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="w-full h-[90vh] flex items-center justify-center">
                <p>Error loading order summary. Please try again.</p>
            </div>
        );
    }

    if (!orderSummary) {
        return (
            <div className="w-full h-[90vh] flex items-center justify-center">
                <p>No order summary found.</p>
            </div>
        );
    }

    return (
        <div className="w-full h-[90vh] flex flex-col items-center justify-center gap-[20px]">
            <div className="w-[95%] h-[40px] bg-[#FFC300] text-black flex items-center justify-center">
                <p className="text-center">{user?.fullName}</p>
            </div>

            <div className="w-[95%]">
                <p className="text-center text-[14px]">
                    Hi {user?.fullName}, Thank you for your {productInfo?.type === 'ticket' ? 'ticket purchase' : 'purchase'}
                </p>
            </div>

            <div className="w-[400px] dark:bg-black bg-[#eeeded] p-[10px] max-[650px]:w-[100%] flex flex-col items-center gap-[20px] rounded-lg">
                {renderProductDetails()}

                <span className="flex w-full justify-between text-[12px]">
                    <p>Amount:</p>
                    <p>{formatNumber(orderSummary.amount)}</p>
                </span>

                <span className="flex w-full justify-between text-[12px]">
                    <p>Transaction Fee:</p>
                    <p>{formatNumber(orderSummary.transaction_fee)}</p>
                </span>

                <span className="flex w-full justify-between text-[12px]">
                    <p>Total Paid:</p>
                    <p>{formatNumber(orderSummary.payable_amount)}</p>
                </span>

                {renderAdditionalInfo()}
            </div>

            <div className="w-[95%] flex flex-col gap-2">
                <span className="flex gap-[10px]">
                    {productInfo?.data.image && (
                        <img
                            src={productInfo.data.image}
                            alt={productInfo.data.name || 'Product'}
                            className="w-[60px] h-[60px] object-cover rounded"
                        />
                    )}
                    <div className="flex flex-col">
                        <p className="text-[12px] font-semibold">{productInfo?.data.name}</p>
                        <p className="text-[10px] text-gray-600 capitalize">
                            {productInfo?.type === 'ticket' ? 'Event Ticket' : productInfo?.type}
                        </p>
                    </div>
                </span>
                {renderProductAction()}
            </div>
        </div>
    );
};

export default OrderSummary;
