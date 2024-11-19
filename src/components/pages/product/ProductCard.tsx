import { IoHeart, IoHeartOutline, IoEyeOutline, IoLink } from "react-icons/io5";
import { FaRegComment, FaUser } from 'react-icons/fa';
import { IProduct } from '../../../interface/ProductInterface';
import { useNavigate } from 'react-router-dom';
import Loading from '../../../loader';
import { copyToClipboard } from '../../../utils/Utils';

interface ProductCardProps {
  product: IProduct;
  loggedInUserId: string;
  handleLikeClick: (productId: string) => void;
  handleEyeClick: (product: IProduct) => void;
  handleCartAddingAuth: (id: string) => void;
  loadingStates: { [key: string]: boolean };
}

const ProductCard = ({ product, loggedInUserId, handleLikeClick, handleEyeClick, handleCartAddingAuth, loadingStates }: ProductCardProps) => {
  const navigate = useNavigate();

  return (
    <div className='w-[300px] h-[500px] shadow-sm rounded-lg p-[10px] flex flex-col gap-[10px]'>
      <div className='w-[100%] relative flex items-center justify-center mb-[10px]'>
        <img src={product?.productImage} className='w-[100%] object-cover aspect-square ' />
        <div
          className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity'
          onClick={() => handleEyeClick(product)}
        >
          <IoEyeOutline size={30} className='text-white cursor-pointer' />
        </div>
      </div>

      <div className='flex items-center gap-[5px]'>
        {product?.merchant?.image ? (
          <img src={product?.merchant?.image} alt='MerchantImage' className='w-[40px] h-[40px] rounded-full object-cover' />
        ) : (
          <FaUser className='w-[30px] h-[30px] rounded-full object-cover' />
        )}
        <p className='text-[20px]'>{product?.merchant?.business_name || product?.merchant.fullName}</p>
      </div>

      <span><p className='text-[15px]'>{product?.productName?.slice(0, 50)}</p></span>

      <span className='flex gap-[10px]'>
        <p className='text-[12px] line-through text-[lightgrey]'>₦{product?.productPrice}</p>
        <p className='text-[12px]'>₦{product?.paymentPrice}</p>
      </span>

      <div className='flex items-center w-[100%] h-[50px]'>
        <span className='flex items-center gap-[5px] w-[20%]'>
          {product?.user_likes?.includes(loggedInUserId) ? (
            <IoHeart size={23} className='text-[#FFC300]' onClick={() => handleLikeClick(product._id)} />
          ) : (
            <IoHeartOutline size={23} className='text-[#FFC300]' onClick={() => handleLikeClick(product._id)} />
          )}
          <p>{product?.total_likes}</p>
        </span>

        <span className='flex items-center gap-[5px] w-[20%]'>
          <FaRegComment size={20} className='text-[#FFC300]' onClick={() => navigate(`/home/comments/${product._id}`)} />
          <p>{product?.comments?.length}</p>
        </span>

        <span className='w-[20%]'>
          <IoLink size={25} className='text-[#FFC300]' onClick={() => copyToClipboard(`https://marketplace.com/#/user_details/${product._id}`)} />
        </span>

        <button className='w-[40%] h-[30px] bg-[#FFC300] rounded-[8px] text-[15px]' onClick={() => handleCartAddingAuth(product._id)} disabled={loadingStates[product._id]}>
          {loadingStates[product._id] ? <Loading /> : 'Buy Now'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
