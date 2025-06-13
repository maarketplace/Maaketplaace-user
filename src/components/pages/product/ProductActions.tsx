import { IoHeart, IoHeartOutline, IoLink } from "react-icons/io5";
import { FaRegComment } from 'react-icons/fa';
import { IProduct } from "../../../interface/ProductInterface";
import Loading from "../../../loader";


interface ProductActionsProps {
    product: IProduct;
    isLiked: boolean;
    onLike: () => void;
    onComment: () => void;
    onShare: () => void;
    onBuyNow: () => void;
    loading: boolean;
}

function ProductActions({ product, isLiked, onLike, onComment, onShare, onBuyNow, loading }: ProductActionsProps) {
    return (
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-4">
                <button
                    className="flex items-center gap-1 text-yellow-500 hover:text-yellow-600 transition-colors"
                    onClick={onLike}
                >
                    {isLiked ? <IoHeart size={20} /> : <IoHeartOutline size={20} />}
                    <span className="text-sm">{product.total_likes}</span>
                </button>

                <button
                    className="flex items-center gap-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                    onClick={onComment}
                >
                    <FaRegComment size={18} />
                    <span className="text-sm">{product.comments?.length || 0}</span>
                </button>

                <button
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                    onClick={onShare}
                >
                    <IoLink size={20} />
                </button>
            </div>

            <button
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-small px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                onClick={onBuyNow}
                disabled={loading}
            >
                {loading ? <Loading /> : 'Buy Now'}
            </button>
        </div>
    );
}

export default ProductActions;