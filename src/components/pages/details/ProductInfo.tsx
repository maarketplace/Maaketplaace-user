// components/ProductDetails/ProductInfo.tsx
import React from 'react';
import { FiUser, FiClock, FiBook, FiStar } from "react-icons/fi";
import { RiPagesLine } from "react-icons/ri";
import { IProduct } from "../../../interface/ProductInterface";

interface ProductInfoProps {
    product: IProduct;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
    const isBook = !!product?.pages;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
                <img
                    src={product?.merchant?.image}
                    alt=""
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-yellow-400/20"
                />
                <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                        {product?.merchant?.business_name || 'Publisher'}
                    </p>
                    <div className="flex items-center gap-1">
                        <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">4.8</span>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                {isBook && product?.pages && (
                    <div className='flex items-center gap-3 text-gray-700 dark:text-gray-300'>
                        <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                            <RiPagesLine className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <span className="text-sm font-medium">{product?.pages} Pages</span>
                    </div>
                )}

                <div className='flex items-center gap-3 text-gray-700 dark:text-gray-300'>
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                        <FiClock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-sm font-medium">{product?.duration}</span>
                </div>

                <div className='flex items-center gap-3 text-gray-700 dark:text-gray-300'>
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                        <FiUser className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-sm font-medium">{product?.author}</span>
                </div>

                {!isBook && (
                    <div className='flex items-center gap-3 text-gray-700 dark:text-gray-300'>
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                            <FiBook className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <span className="text-sm font-medium">Learn at your own pace</span>
                    </div>
                )}
            </div>
        </div>
    );
};
