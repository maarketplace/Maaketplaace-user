import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { IoHeart, IoHeartOutline, IoLink } from "react-icons/io5";
import { FaRegComment } from 'react-icons/fa';
import { useAuth } from '../../../context/Auth';
import { getAllProduct } from '../../../api/query';
import { userBuyNow, userLike, userPayWithKora } from '../../../api/mutation';
import { IProduct } from '../../../interface/ProductInterface';
import { useUser } from '../../../context/GetUser';
import { copyToClipboard } from '../../../utils/CopytoClip';
import PaymentModal from '../../../utils/PaymentModal';

function Product() {
    const { isUserAuthenticated } = useAuth();
    const { data } = useUser();
    const queryClient = useQueryClient();
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
    const loggedInUserId = data?._id;
    const navigate = useNavigate();

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
        {
            onSuccess: () => queryClient.invalidateQueries('getallproduct'),
            onError: (err) => console.log('Error:', err),
        }
    );

    const handleLikeClick = async (productId: string) => {
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
    };

    const { mutate: buyMutate, isLoading:buyNowLoading } = useMutation(['buynow'],
        userBuyNow,
        {
            onSuccess: (data: any) => {
                console.log(data?.data?.data?.data);
                // Extract payment details from the successful response
                const paymentAmount = data?.data?.data?.data?.amount || '₦0';
                const paymentFee = data?.data?.data?.data?.transaction_fee || '₦0';
                const paymentID = data?.data?.data?.data?._id
                const paymentAPI = data?.data?.data?.paymentData?.payment_type
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

                setIsModalOpen(true);
            },
            onError: (error) => {
                console.log('Error:', error);
            }
        }
    );

    const handleCartAddingAuth = (id: string) => {
        if (isUserAuthenticated) {
            buyMutate(id);
        } else {
            navigate('/');
        }
    };
    const { mutate: payNowMutate } = useMutation(['paynow'], userPayWithKora, {
        onSuccess: (data) => {
            // console.log(data);
            const paymentAmount = data?.data?.data?.data?.paymentData?.amount || '₦0';
            const payeeName = data?.data?.data?.data?.payamentData?.customer?.name
            const payeeEmail = data?.data?.data?.data?.payamentData?.customer?.email
            const paymentAPI = data?.data?.data?.data?.paymentData?.payment_type
            const checkoutURL = data?.data?.data?.data?.data?.data?.checkout_url
            setPaymentDetails({
                amount: paymentAmount,
                fee: '',
                paymentID: '',
                paymentAPI: paymentAPI,
                payeeName: payeeName,
                payeeEmail: payeeEmail,
                checkoutURL: checkoutURL,
                source: 'payNow',
            });
            setIsModalOpen(true)
        },
        onError: (error) => {
            setIsModalOpen(false)
            console.log(error);

        }
    })
    return (
        <div className="w-[100%] mt-[30px] dark:bg-black dark:text-white">
            {
                isLoading ?
                    <div className="w-[100%] h-[80vh] flex items-center justify-center">
                        <p>Loading Product....</p>
                    </div>
                    :
                    allProduct?.length !== 0
                        ?
                        <div className="w-[100%] h-[80vh] overflow-auto p-0 flex flex-wrap gap-[10px] justify-center ">
                            {allProduct?.map((i: IProduct) => (
                                <div className='w-[300px] border  rounded-lg p-[10px] flex flex-col gap-[10px] dark:bg-black dark:text-white max-[650px]:border-none max-[650px]:bg-slate-50 max-[650px]:w-[100%] max-[650px]:rounded-none ' key={i?._id} >
                                    <div className='w-[100%]  flex items-center justify-center mb-[10px]'>
                                        <img src={i?.productImage} className='w-[100%] object-cover aspect-square ' onClick={() => navigate(`/home/details/${i?._id}`)} />
                                    </div>
                                    <span >
                                        <p className='text-[20px]'>{i?.productName?.slice(0, 50)}</p>
                                    </span>
                                    <span className='flex gap-[10px]'>
                                        <p className='text-[15px] line-through text-[lightgrey]'>₦{i?.productPrice}</p>
                                        <p className='text-[15px]'>₦{i?.paymentPrice}</p>
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
                                                <FaRegComment size={20} className='text-[#FFC300]' onClick={() => navigate(`/user_details/${i?._id}`)} />
                                                <p>{i?.comments?.length}</p>
                                            </span>
                                            <span className='w-[20%]'>
                                                <IoLink size={25} className='text-[#FFC300]' onClick={() => copyToClipboard(`https://maarketplaace.com/#/user_details/${i?._id}`)} />
                                            </span>
                                            <button
                                                className='w-[40%] h-[30px] bg-[#FFC300] rounded-[8px] text-[15px]'
                                                onClick={() => handleCartAddingAuth(i?._id)}
                                                disabled={buyNowLoading}
                                            >
                                                {buyNowLoading ? 'Buying': 'Buy Now'}
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

            <PaymentModal
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
                title="Proceed to Payment"
                amount={paymentDetails.amount}
                fee={paymentDetails.fee}
                paymentAPI={paymentDetails.paymentAPI}
                payeeEmail={paymentDetails.payeeEmail}
                payeeName={paymentDetails.payeeName}
                primaryButton={{
                    text: paymentDetails.source === 'payNow' ? (
                        <a href={paymentDetails.checkoutURL} rel="noopener noreferrer">
                            <button className="w-[70%] h-[30px] bg-[#FFC300] rounded-[8px] text-[15px]">
                                Pay Now
                            </button>
                        </a>
                    ) : (
                        <button className="w-[70%] h-[30px] bg-[#FFC300] rounded-[8px] text-[15px]" onClick={() => payNowMutate(paymentDetails.paymentID)}>
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
    );
}

export default Product;
