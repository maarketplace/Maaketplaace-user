import React from 'react';
import { IProduct } from "../../../interface/ProductInterface";
import Loading from "../../../loader";

interface PurchaseButtonProps {
    product: IProduct;
    loadingStates: { [key: string]: boolean };
    onPurchase: (id: string) => void;
}

export const PurchaseButton: React.FC<PurchaseButtonProps> = ({
    product,
    loadingStates,
    onPurchase
}) => {
    const isLoading = loadingStates[product?._id];

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {product?.paymentPrice === 0 ? (
                        <span className="text-lg font-semibold text-green-600">Free</span>
                    ) : (
                        <>
                            {product?.productPrice !== product?.paymentPrice && (
                                <span className="text-sm text-gray-400 line-through">
                                    ₦{product?.productPrice?.toLocaleString()}
                                </span>
                            )}
                            <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                ₦{product?.paymentPrice?.toLocaleString()}
                            </span>
                        </>
                    )}
                </div>
                <div className="text-right">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        {Math.round(((product?.productPrice - product?.paymentPrice) / product?.productPrice) * 100)}% OFF
                    </span>
                </div>
            </div>

            <button
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
                onClick={() => onPurchase(product?._id)}
                disabled={isLoading}
            >
                {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                        <Loading />
                    </div>
                ) : (
                        `${product?.paymentPrice === 0 ? 'Get' : 'Buy'} Now`
                )}
            </button>
        </div>
    );
};
