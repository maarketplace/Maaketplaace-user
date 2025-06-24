import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoEyeOutline } from "react-icons/io5";
import { FaUser } from 'react-icons/fa';
import ProductActions from './ProductActions';
import { useUser } from '../../../context/GetUser';
import { IProduct } from '../../../interface/ProductInterface';
import { copyToClipboard } from '../../../utils/Utils';

interface ProductCardProps {
  product: IProduct;
  onLike: (productId: string) => void;
  onFollow: (merchantId: string) => void;
  onBuyNow: (productId: string) => void;
  onView: (product: IProduct) => void;
  loadingStates: { [key: string]: boolean };
  loadingBuy: boolean;
  loadingLike: boolean;
  loadingFollow: boolean;
}

function ProductCard({ product, onLike, onFollow, onBuyNow, onView, loadingStates }: ProductCardProps) {
  const navigate = useNavigate();
  const { user } = useUser();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const loggedInUserId = user?._id;

  const handleMerchantClick = (businessName: string) => {
    const formattedName = businessName.trim().replace(/\s+/g, "-");
    navigate(`/store/${formattedName}`);
  };

  const handleShareProduct = () => {
    copyToClipboard(`https://www.maarketplaace.com/details/${product._id}`);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  const isLiked = product?.user_likes && loggedInUserId && product.user_likes.includes(loggedInUserId);
  const isFollowing = product?.merchant?.followedUsers?.includes(loggedInUserId ?? '');

  return (
    <div className="group dark:bg-black dark:border-gray-700 transition-all duration-300 overflow-hidden border border-t">
      <div className="relative aspect-square overflow-hidden">
        <div className="absolute top-3 left-3">
          <span className="bg-yellow-400 text-black text-xs font-semibold px-3 py-1 rounded-full uppercase">
            {product?.productType}
          </span>
        </div>

        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-gray-300 border-t-yellow-400 rounded-full animate-spin"></div>
          </div>
        )}

        {imageError && (
          <div className="absolute inset-0 bg-gray-100 dark:bg-gray-700 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
            <svg className="w-16 h-16 mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            <p className="text-sm">Image not available</p>
          </div>
        )}

        <img
          src={product?.productImage}
          alt={product?.productName}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />

        {imageLoaded && (
          <div
            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
            onClick={() => onView(product)}
          >
            <div className="text-white text-center">
              <IoEyeOutline size={32} className="mx-auto mb-2" />
              <p className="text-sm font-medium">Quick View</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity flex-1"
            onClick={() => handleMerchantClick(product?.merchant?.business_name)}
          >
            {product?.merchant?.image ? (
              <img
                src={product?.merchant?.image}
                alt="Merchant"
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                <FaUser className="text-gray-500 text-sm" />
              </div>
            )}
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
              {product?.merchant?.business_name?.slice(0, 20) || product?.merchant?.fullName}
            </p>
          </div>

          <button
            className={`text-xs px-3 py-1 rounded-full border transition-colors ${isFollowing
              ? 'bg-yellow-400 text-black border-yellow-400'
              : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-yellow-400 hover:text-yellow-600'
              }`}
            onClick={() => onFollow(product?.merchant?._id)}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>
        </div>

        <h3 className="font-semibold text-gray-900 dark:text-white text-lg leading-tight line-clamp-2">
          {product?.productName}
        </h3>

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

        <div
          className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2"
          dangerouslySetInnerHTML={{ __html: product?.productDescription?.slice(0, 100) + '...' }}
        />

        <ProductActions
          product={product}
          isLiked={!!isLiked}
          onLike={() => onLike(product._id)}
          onComment={() => navigate(`/comments/${product._id}`)}
          onShare={handleShareProduct}
          onBuyNow={() => onBuyNow(product._id)}
          loading={loadingStates[product._id]}
        />
      </div>
    </div>
  );
}

export default ProductCard;