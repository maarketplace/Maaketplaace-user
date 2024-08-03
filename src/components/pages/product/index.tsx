import 'swiper/css';
import 'swiper/css/pagination';
import { IoHeart, IoHeartOutline, IoLink } from "react-icons/io5";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import { FaRegComment } from 'react-icons/fa';
import { useCart } from '../../../context/Cart';
import { getAllProduct } from '../../../api/query';
import { userLike } from '../../../api/mutation';
import { IProduct } from '../../../interface/ProductInterface';
import { useUser } from '../../../context/GetUser';

function Product() {
    const { userHandleAddToCart, isUserAuthenticated } = useCart()
    const { data } = useUser()
    const queryClient = useQueryClient()
    const [allProduct, setAllProduct] = useState<any>([])
    // console.log(allProduct);

    const loggedInUserId = data?._id
    const navigate = useNavigate()
    const {
        data: allProductData, isLoading
    } = useQuery(["getallproduct"], getAllProduct, {
        onSuccess: () => {
        },
        onError: () => {
        },
    });

    useEffect(() => {
        if (allProductData && allProductData?.data && allProductData?.data?.data) {
            // Reverse the order of the data array received from the API
            const reversedData = [...allProductData?.data?.data]?.reverse();
            setAllProduct(reversedData);
            // console.log(reversedData);
        }
    }, [data]);

    const { mutate } = useMutation(
        ['userlike'],
        userLike,
        {
            onSuccess: async () => {
                queryClient.invalidateQueries('getallproduct')
            },
            onError: (err) => {
                console.log('Error:', err);
            },
        }
    );

    const handleLikeClick = async (productId: string) => {
        const updateLikeProduct = [...allProduct]
        const existingItem = updateLikeProduct?.findIndex((product: { _id: string; }) => product?._id === productId)
        if (existingItem !== -1 && !updateLikeProduct[existingItem]?.user_likes?.includes(loggedInUserId)) {
            updateLikeProduct[existingItem].total_likes += 1
            updateLikeProduct[existingItem]?.user_likes?.push(loggedInUserId)
            mutate(productId)
        } else if (existingItem !== -1 && updateLikeProduct[existingItem]?.user_likes?.includes(loggedInUserId)) {
            updateLikeProduct[existingItem].total_likes -= 1
            updateLikeProduct[existingItem]?.user_likes?.pop(loggedInUserId)
            mutate(productId)
        }
        // console.log(updateLikeProduct);
        setAllProduct(updateLikeProduct)

    };

    const copyToClipboard = (text: string) => {
        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = text;
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        document.execCommand('copy');
        document.body.removeChild(tempTextArea);
        toast.success('Link copied successfully!');
    };
    const handleCartAddingAuth = (id: string) => {
        useEffect(() => {
            if (isUserAuthenticated) {
                userHandleAddToCart(id)
            } else {
                navigate('/userlogin')
            }
        }, [])
    }
    return (
        <div className="w-[100%]">
            {
                isLoading ?
                    <div className="w-[100%] h-[80vh] flex items-center justify-center">
                        <p>Loading Product....</p>
                    </div>
                    :
                    allProduct?.length !== 0
                        ?
                        <div className="w-[100%] h-[80vh] overflow-auto p-0 flex flex-wrap gap-[10px] justify-center">
                            {allProduct?.map((i: IProduct) => (
                                <div className='w-[300px] h-[450px] border  rounded-lg p-[10px] flex flex-col gap-[10px] max-[650px]:border-none max-[650px]:bg-slate-50 max-[650px]:w-[100%] max-[650px]:rounded-none ' key={i?._id} >
                                    <div className='w-[100%] h-[250px] flex items-center justify-center'>
                                        <img src={i.productImage} className='w-[100%] h-[100%] object-fill ' onClick={() => navigate(`/home/details/${i._id}`)} />
                                    </div>
                                    <span >
                                        <p className='text-[20px]'>{i?.productName?.slice(0, 50)}</p>
                                    </span>
                                    <span className='flex gap-[10px]'>
                                        <p className='text-[15px] line-through text-[lightgrey]'>₦{i?.productPrice}</p>
                                        <p className='text-[15px]'>₦{i?.paymentPrice}</p>
                                    </span>
                                    <span className='flex gap-[10px] text-[12px] '>
                                        <div dangerouslySetInnerHTML={{ __html: i?.productDescription.slice(0, 30) }} />
                                    </span>
                                    <div className='w-[100%] flex flex-col'>
                                        <div className='flex items-center w-[100%] h-[50px]'>
                                            <span className='flex items-center gap-[5px] w-[20%]'>
                                                {i.user_likes && i.user_likes.includes(loggedInUserId) ?
                                                    <IoHeart
                                                        size={23}
                                                        className='text-[#FFC300]'
                                                        onClick={() => handleLikeClick(i._id)}
                                                    />
                                                    :
                                                    <IoHeartOutline
                                                        size={23}
                                                        className='text-[#FFC300]'
                                                        onClick={() => handleLikeClick(i._id)}
                                                    />
                                                }
                                                <p >{i.total_likes}</p>
                                            </span>
                                            <span className='flex items-center gap-[5px] w-[20%]'>
                                                <FaRegComment size={20} className='text-[#FFC300]' onClick={() => navigate(`/user_details/${i._id}`)} />
                                                <p>{i?.comments?.length}</p>
                                            </span>
                                            <span className='w-[20%]'>
                                                <IoLink size={25} className='text-[#FFC300]' onClick={() => copyToClipboard(`https://maarketplaace.com/#/user_details/${i._id}`)} />
                                            </span>
                                            <button
                                                className='w-[40%] h-[30px] bg-[#FFC300] rounded-[8px] text-[15px]'
                                                onClick={() => handleCartAddingAuth(i._id)}
                                            >
                                                Buy Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        :
                        <div className='w-[100%] h-[80vh] flex items-center justify-center'>
                            <p>No product available yet</p>
                        </div>
            }
        </div>
    )
}

export default Product

