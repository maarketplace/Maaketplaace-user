import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';
import { IoHeart, IoHeartOutline, IoLink } from "react-icons/io5";
import { FaRegComment, FaUser } from 'react-icons/fa';
import { useAuth } from '../../../context/Auth';
import { getAllProduct } from '../../../api/query';
import { userBuyNow, userLike, userPayWithKora } from '../../../api/mutation';
import { IProduct } from '../../../interface/ProductInterface';
import { useUser } from '../../../context/GetUser';
import { copyToClipboard } from '../../../utils/CopytoClip';
import PaymentModal from '../../../utils/PaymentModal';
import toast from 'react-hot-toast';

function Product() {
    const navigate = useNavigate();
    const { isUserAuthenticated } = useAuth();
    const { data } = useUser();
    const [allProduct, setAllProduct] = useState<any>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [paymentDetails, setPaymentDetails] = useState(
        {
            amount: '',
            fee: '',
            paymentID: '',
            paymentAPI: '',
            payeeName: '',
            payeeEmail: '',
            checkoutURL: '',
            source: '',
        });
    const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
    const loggedInUserId = data?._id;

    const {
        data: allProductData, isLoading
    } = useQuery(["getallproduct"], getAllProduct);

    useEffect(() => {
        if (allProductData?.data?.data?.products) {
            const reversedData = [...allProductData.data.data.products].reverse();
            setAllProduct(reversedData);
        }
    }, [allProductData]);

    const { mutate } = useMutation(
        ['userlike'],
        userLike,
    );

    const handleLikeClick = async (productId: string) => {
        if (isUserAuthenticated) {
            const updateLikeProduct = [...allProduct];
            const existingItem = updateLikeProduct.findIndex((product: { _id: string; }) => product._id === productId);
            if (existingItem !== -1 && !updateLikeProduct[existingItem]?.user_likes?.includes(loggedInUserId)) {
                updateLikeProduct[existingItem].total_likes += 1;
                updateLikeProduct[existingItem]?.user_likes?.push(loggedInUserId);
                mutate(productId);
            } else if (existingItem !== -1 && updateLikeProduct[existingItem]?.user_likes?.includes(loggedInUserId)) {
                updateLikeProduct[existingItem].total_likes -= 1;
                updateLikeProduct[existingItem]?.user_likes?.pop(loggedInUserId);
                mutate(productId);
            }
            setAllProduct(updateLikeProduct);
        } else {
            toast.error("Please login to like this Product")
            setTimeout(() => {
                navigate('/')
            }, 2000)
        }

    };

    const { mutate: buyMutate } = useMutation(['buynow'],
        userBuyNow,
        {
            onSuccess: () => {
            },
            onError: (error) => {
                console.log('Error:', error);
            }
        }
    );

    const handleCartAddingAuth = (id: string) => {
        if (isUserAuthenticated) {
            setLoadingStates(prevState => ({
                ...prevState,
                [id]: true,
            }));

            buyMutate(id, {
                onSuccess: (response) => {
                    const paymentAmount = response?.data?.data?.data?.amount || '₦0';
                    const paymentFee = response?.data?.data?.data?.transaction_fee || '₦0';
                    const paymentID = response?.data?.data?.data?._id;
                    const paymentAPI = response?.data?.data?.paymentData?.payment_type;

                    setPaymentDetails({
                        amount: paymentAmount,
                        fee: paymentFee,
                        paymentID: paymentID,
                        paymentAPI: paymentAPI,
                        payeeName: '',
                        payeeEmail: '',
                        checkoutURL: '',
                        source: 'buyNow',
                    });

                    setTimeout(() => {
                        setIsModalOpen(true);
                    }, 2000);

                    setLoadingStates(prevState => ({
                        ...prevState,
                        [id]: false,
                    }));
                },
                onError: (error) => {
                    console.log('Error:', error);
                    setLoadingStates(prevState => ({
                        ...prevState,
                        [id]: false,
                    }));
                }
            });
        } else {
            navigate('/');
        }
    };

    const { mutate: payNowMutate } = useMutation(['paynow'], userPayWithKora, {
        onSuccess: (data) => {
            const innerData = data?.data?.data?.data?.data?.data;
            const paymentData = data?.data?.data?.data?.paymentData;
            console.log(paymentData);
            console.log(innerData);
            const paymentAmount = paymentData?.amount || '₦0';
            const payeeName = paymentData?.customer?.name || '';
            const payeeEmail = paymentData?.customer?.email || '';
            const paymentAPI = paymentData?.payment_type || '';
            const checkoutURL = innerData?.checkout_url || '';

            setPaymentDetails({
                amount: paymentAmount,
                fee: '',
                paymentID: paymentData?._id || '',
                paymentAPI: paymentAPI,
                payeeName: payeeName,
                payeeEmail: payeeEmail,
                checkoutURL: checkoutURL,
                source: 'payNow',
            });
            console.log(paymentDetails);

            setTimeout(() => {
                setIsModalOpen(true);
            }, 2000);
        },
        onError: (error) => {
            setIsModalOpen(false);
            console.log(error);
        }
    });

    return (
        <div className="w-[100%] mt-[30px] max-[650px]:mt-[5px] dark:bg-black dark:text-white">
            {
                isLoading ?
                    <div className="w-[100%] h-[80vh] flex items-center justify-center">
                        <p>Loading Product....</p>
                    </div>
                    :
                    allProduct?.length !== 0
                        ?
                        <div className="w-[100%] h-[80vh] overflow-scroll p-0 flex flex-wrap gap-[10px] justify-center ">
                            {allProduct?.map((i: IProduct) => (
                                <div key={i?._id} className='w-[300px]  border  rounded-lg p-[10px] flex flex-col gap-[10px] dark:bg-black dark:text-white max-[650px]:border-none max-[650px]:bg-slate-50 max-[650px]:w-[100%] max-[650px]:rounded-none ' >
                                    <div className='w-[100%]  flex items-center justify-center mb-[10px]'>
                                        <img src={i?.productImage} className='w-[100%] object-cover aspect-square ' onClick={() => navigate(`/home/details/${i?._id}`)} />
                                    </div>
                                    <div className='flex items-center gap-[5px]' onClick={() => navigate(`/home/store/${i?.merchant._id}`)}>
                                        {
                                            !i?.merchant?.image ? <FaUser className='w-[30px] h-[30px] rounded-full object-cover' /> : <img src={i?.merchant?.image} alt='MerchantImage' className='w-[40px] h-[40px] rounded-full object-cover' />
                                        }

                                        <p className='text-[20px]'>{i?.merchant?.business_name || i?.merchant.fullName}</p>
                                    </div>
                                    <span >
                                        <p className='text-[15px]'>{i?.productName?.slice(0, 50)}</p>
                                    </span>
                                    <span className='flex gap-[10px]'>
                                        <p className='text-[12px] line-through text-[lightgrey]'>₦{i?.productPrice}</p>
                                        <p className='text-[12px]'>₦{i?.paymentPrice}</p>
                                    </span>
                                    <span className='flex gap-[10px] text-[12px] '>
                                        <div dangerouslySetInnerHTML={{ __html: i?.productDescription?.slice(0, 30) }} />
                                    </span>
                                    <div className='w-[100%] flex flex-col'>
                                        <div className='flex items-center w-[100%] h-[50px]'>
                                            <span className='flex items-center gap-[5px] w-[20%]'>
                                                {i?.user_likes && i?.user_likes.includes(loggedInUserId) ?
                                                    <IoHeart
                                                        size={23}
                                                        className='text-[#FFC300]'
                                                        onClick={() => handleLikeClick(i?._id)}
                                                    />
                                                    :
                                                    <IoHeartOutline
                                                        size={23}
                                                        className='text-[#FFC300]'
                                                        onClick={() => handleLikeClick(i?._id)}
                                                    />
                                                }
                                                <p >{i?.total_likes}</p>
                                            </span>
                                            <span className='flex items-center gap-[5px] w-[20%]'>
                                                <FaRegComment size={20} className='text-[#FFC300]' onClick={() => navigate(`/home/comments/${i?._id}`)} />
                                                <p>{i?.comments?.length}</p>
                                            </span>
                                            <span className='w-[20%]'>
                                                <IoLink size={25} className='text-[#FFC300]' onClick={() => copyToClipboard(`https://maarketplaace.com/#/user_details/${i?._id}`)} />
                                            </span>
                                            <button
                                                className='w-[40%] h-[30px] bg-[#FFC300] rounded-[8px] text-[15px]'
                                                onClick={() => handleCartAddingAuth(i?._id)}
                                                disabled={loadingStates[i?._id]}
                                            >
                                                {loadingStates[i?._id] ? 'Buying' : 'Buy Now'}
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
            {
                isModalOpen &&
                <div className='absolute w-full h-full top-0 bottom-0 left-0 right-0'>
                    <PaymentModal
                        isOpen={isModalOpen}
                        setIsOpen={setIsModalOpen}
                        title={paymentDetails.source === 'payNow' ? "Complete Your Payment" : "Proceed to Payment"}
                        amount={paymentDetails.amount}
                        fee={paymentDetails.source === 'buyNow' ? paymentDetails.fee : ''}
                        paymentAPI={paymentDetails.source === 'payNow' ? paymentDetails.paymentAPI : ''}
                        payeeEmail={paymentDetails.source === 'payNow' ? paymentDetails.payeeEmail : ''}
                        payeeName={paymentDetails.source === 'payNow' ? paymentDetails.payeeName : ''}
                        primaryButton={{
                            text: paymentDetails.source === 'payNow' ? (
                                <a href={paymentDetails.checkoutURL} rel="noopener noreferrer">
                                    <button className="w-[70%] h-[30px] bg-[#FFC300] rounded-[8px] text-[14px]">
                                        Pay Now
                                    </button>
                                </a>
                            ) : (
                                <button className="w-[70%] h-[30px] bg-[#FFC300] rounded-[8px] text-[10px] " onClick={() => payNowMutate(paymentDetails.paymentID)}>
                                    Buy Now
                                </button>
                            ),
                            display: true,
                            primary: true,
                        }}
                        secondaryButton={{
                            text: "Cancel",
                            onClick: () => setIsModalOpen(false),
                            display: true,
                            primary: true,
                        }}
                    />
                </div>
            }

        </div>
    );
}

export default Product;
