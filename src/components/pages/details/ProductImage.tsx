import React, { useState } from 'react';
import { FiHeart } from "react-icons/fi";
import { IProduct } from "../../../interface/ProductInterface";

interface ProductImageProps {
    product: IProduct;
}

export const ProductImage: React.FC<ProductImageProps> = ({ product }) => {
    const [imageLoading, setImageLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);

    return (
        <div className="relative group">
            <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
                <img
                    src={product?.productImage}
                    alt={product?.productName}
                    className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${imageLoading ? 'opacity-0' : 'opacity-100'
                        }`}
                    onLoad={() => setImageLoading(false)}
                />
                <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="absolute top-3 right-3 w-10 h-10 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 hover:scale-110"
                >
                    <FiHeart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-300'}`} />
                </button>
            </div>
        </div>
    );
};