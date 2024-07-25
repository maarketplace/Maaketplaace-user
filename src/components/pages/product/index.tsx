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
        data: allProductData,
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
            console.log(reversedData);
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
                allProduct?.length === 0 ?
                    <div className='w-[100%] h-[90vh] flex items-center justify-center'>
                        <p>No product available yet</p>
                    </div>
                    :

                    <div className="w-[100%] h-[80vh] overflow-auto  flex flex-wrap gap-[10px] justify-center">
                        {allProduct?.map((i: IProduct) => (
                            <div className='w-[300px] h-[400px] ' key={i?._id} >
                                {/* <div className=''>
                                    <span >
                                        <img src={i?.merchant.image} alt="" className='w-[250px] h-[100px]' />
                                        <span onClick={() => navigate(`/userhome/admin_store/${i?.merchant?._id}`)}>
                                            <p className=''>{i?.merchant?.fullName}</p>
                                        </span>
                                    </span>
                                    <button className=''>Follow</button>
                                </div> */}
                                <span >
                                    <p>{i?.productName?.slice(0, 50)}</p>
                                </span>
                                <div className='w-[200px] h-[200px]'>
                                    <img src={i.productImage} className='w-[100%] h-[100%] object-cover ' onClick={() => navigate(`/user_details/${i._id}`)} />
                                </div>
                                <span className='flex gap-[10px]'>
                                    <p className=''>₦{i?.productPrice}</p>
                                    <p>₦{i?.paymentPrice}</p>
                                </span>
                                <div className='w-[100%] flex flex-col'>
                                    <div className='flex'>
                                        <span className='flex '>
                                            {i.user_likes && i.user_likes.includes(loggedInUserId) ?
                                                <IoHeart
                                                    size={23}
                                                    className='liked'
                                                    onClick={() => handleLikeClick(i._id)}
                                                />
                                                :
                                                <IoHeartOutline
                                                    size={23}
                                                    style={{ color: "#ecdc51" }}
                                                    onClick={() => handleLikeClick(i._id)}
                                                />
                                            }
                                            <p >{i.total_likes}</p>
                                        </span>
                                        <span className='flex'>
                                            <FaRegComment size={20} className='Icons' onClick={() => navigate(`/user_details/${i._id}`)} style={{ color: "#ecdc51" }} />
                                            <p>{i?.comments?.length}</p>
                                        </span>
                                        <span className=''>
                                            <IoLink size={25} className='Icons' onClick={() => copyToClipboard(`https://maarketplaace.com/#/user_details/${i._id}`)} style={{ color: "#ecdc51" }} />
                                        </span>
                                    </div>
                                    <div className=''>
                                        <button
                                            className=''
                                            onClick={() => handleCartAddingAuth(i._id)}
                                        >
                                            Add to cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
            }
        </div>
    )
}

export default Product

