import React from 'react';
import { IProduct } from "../../../interface/ProductInterface";
import Loading from "../../../loader";

interface ProductCardProps {
    product: IProduct;
    loadingStates: { [key: string]: boolean };
    onPurchase: (id: string) => void;
    onNavigate: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
    product,
    loadingStates,
    onPurchase,
    onNavigate
}) => {
    return (
        <div className="bg-white dark:bg-black rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
            <div
                className="aspect-[4/3] bg-gray-100 dark:bg-gray-700 cursor-pointer"
                onClick={() => onNavigate(product._id)}
            >
                <img
                    src={product?.productImage}
                    alt={product?.productName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
            </div>

            <div className="p-4">
                <h3
                    className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 cursor-pointer hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
                    onClick={() => onNavigate(product._id)}
                >
                    {product?.productName}
                </h3>

                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                            ₦{product?.paymentPrice}
                        </span>
                        {product?.productPrice !== product?.paymentPrice && (
                            <span className="text-sm text-gray-500 line-through">
                                ₦{product?.productPrice}
                            </span>
                        )}
                    </div>
                </div>

                <button
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                    onClick={(e) => {
                        e.stopPropagation();
                        onPurchase(product._id);
                    }}
                >
                    {loadingStates[product._id] ? <Loading /> : 'Buy Now'}
                </button>
            </div>
        </div>
    );
};