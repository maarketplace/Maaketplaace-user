import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';
import { IoHeart, IoHeartOutline, IoLink } from "react-icons/io5";
import { FaRegComment, FaUser } from 'react-icons/fa';
import { useAuth } from '../../../context/Auth';
import { getAllProduct } from '../../../api/query';
import { userBuyNow, userFollowMerchant, userLike, userPayWithKora } from '../../../api/mutation';
import { IProduct } from '../../../interface/ProductInterface';
import { useUser } from '../../../context/GetUser';
import { copyToClipboard } from '../../../utils/CopytoClip';
import PaymentModal from '../../../utils/PaymentModal';
import toast from 'react-hot-toast';
import Loading from '../../../loader';
import { IoEyeOutline } from 'react-icons/io5';
import Modal from '../../../utils/ProductModal';
import { RiPagesLine } from "react-icons/ri";
import { IoMdTime } from 'react-icons/io';
import { FiUser } from 'react-icons/fi';
import { CiMoneyCheck1 } from "react-icons/ci";
import ProductReels from '../reels';
import { SearchContext } from '../../../context/Search';
import { handleBuyNow, handlePayNow } from '../../../utils/PaymentComponent';


function Product() {
    const context = useContext(SearchContext);
    const navigate = useNavigate();
    const { isUserAuthenticated } = useAuth();
    const { data } = useUser();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
    const [followingMerchants, setFollowingMerchants] = useState<string[]>([]);

    const loggedInUserId = data?._id;

    const {
        data: allProductData, isLoading
    } = useQuery(["getallproduct"], getAllProduct);

    useEffect(() => {
        if (allProductData?.data?.data?.products) {
            const reversedData = [...allProductData.data.data.products].reverse();
            setAllProduct(reversedData);
            // console.log(allProductData);

        }
    }, [allProductData]);

    const { mutate } = useMutation(
        ['userlike'],
        userLike,
    );
    const { mutate: followMutate } = useMutation(
        ['userFollowMerchant'],
        userFollowMerchant,
        {
            onSuccess: (_data, merchantId) => {
                // On successful follow, update the list of followed merchants
                setFollowingMerchants((prev) => [...prev, merchantId]);
            },
        }
    );

    const handleFollowMerchant = (merchantId: string) => {
        if (isUserAuthenticated) {
            followMutate(merchantId);
        } else {
            toast.error("Please login to follow this merchant");
            setTimeout(() => {
                navigate('/');
            }, 2000);
        }
    };

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

    const { mutate: buyMutate } = useMutation(['buynow'], userBuyNow,);

    const handleCartAddingAuth = (id: string) => {
        handleBuyNow(id, isUserAuthenticated, setLoadingStates, setPaymentDetails, setIsModalOpen, buyMutate, navigate);
    };

    const { mutate: payNowMutate, isLoading: paymutateLoading } = useMutation(['paynow'], userPayWithKora);

    const handlePayment = (paymentID: string) => {
        handlePayNow(payNowMutate, paymentID, setPaymentDetails, setIsModalOpen);
    };

    const handleEyeClick = (product: IProduct) => {
        setSelectedProduct(product);
        setIsProductModalOpen(true);
        console.log(selectedProduct);
    };
    const handleMerchantClick = (businessName: string) => {
        navigate(`/home/store?businessName=${encodeURIComponent(businessName)}`);
    };
    if (!context) {
        return null;
    }
    const { searchQuery } = context
    const filteredProducts = allProduct?.filter((product: IProduct) =>
        product?.productName?.toLowerCase().includes(searchQuery?.trim().toLowerCase())
    );
    return (
        <div className="w-[100%] h-[] mt-[20px] mb-[60px] max-[650px]:mt-[30px] flex justify-center flex-col items-center dark:bg-black dark:text-white overflow-scroll no-scrollbar">
            <ProductReels />

            {
                isLoading ?
                    <div className="w-[100%] h-[80vh] flex justify-center">
                        <p>Loading Product....</p>
                    </div>
                    :
                    filteredProducts?.length !== 0
                        ?
                        <div className="w-[95%] h-[] overflow-scroll no-scrollbar p-0 flex flex-wrap gap-[10px] max-[650px]:gap-0 mb-[80px]  max-[650px]:mb-[60px] ">
                            {filteredProducts?.map((i: IProduct) => (
                                <div key={i?._id} className='w-[280px] h-[500px] shadow-sm dark:shadow-[white] rounded-lg p-[10px] flex flex-col gap-[10px] dark:bg-black dark:text-white max-[650px]:border-none max-[650px]:bg-slate-50 max-[650px]:w-[100%] max-[650px]:rounded-none max-[650px]:h-auto' >
                                    <div className='w-[100%] relative flex items-center justify-center mb-[10px]'>
                                        <img src={i?.productImage} className='w-[100%] object-cover aspect-square filter brightness-225 contrast-110 transition-all duration-500 ease-in-out' />
                                        <div
                                            className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity'
                                            onClick={() => handleEyeClick(i)}
                                        >
                                            <IoEyeOutline size={30} className='text-white cursor-pointer' />
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-[5px] justify-between' >
                                        <span className='w-[80%] flex items-center gap-[10px]  cursor-pointer' onClick={() => handleMerchantClick(i?.merchant?.business_name)}>
                                            {
                                                !i?.merchant?.image ? <FaUser className='w-[30px] h-[30px] rounded-full object-cover' /> : <img src={i?.merchant?.image} alt='MerchantImage' className='w-[40px] h-[40px] rounded-full object-cover' />
                                            }

                                            <p className='text-[18px]'>{i?.merchant?.business_name || i?.merchant?.fullName}</p>
                                        </span>
                                        <button
                                            className='text-[12px]'
                                            onClick={() => handleFollowMerchant(i?.merchant?._id)}
                                        >
                                            {followingMerchants?.includes(i?.merchant?._id) ? "Following" : "Follow"}
                                        </button>
                                    </div>
                                    <span >
                                        <p className='text-[14px] truncate'>{i?.productName} </p>
                                    </span>
                                    <span className='flex gap-[10px]'>
                                        <p className='text-[12px] line-through text-[lightgrey]'>₦{i?.productPrice}</p>
                                        <p className='text-[12px]'>₦{i?.paymentPrice}</p>
                                    </span>
                                    <span className='flex gap-[10px] text-[12px] '>
                                        <div className='' dangerouslySetInnerHTML={{ __html: i?.productDescription?.slice(0, 45) }} />
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
                                                {loadingStates[i?._id] ? <Loading /> : 'Buy Now'}
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
                <div className=' w-full h-full bottom-2 fixed z-[100]'>
                    <PaymentModal
                        isOpen={isModalOpen}
                        setIsOpen={setIsModalOpen}
                        title={paymentDetails?.source === 'payNow' ? "Complete Your Payment" : "Proceed to Payment"}
                        amount={paymentDetails?.amount}
                        fee={paymentDetails?.source === 'buyNow' ? paymentDetails?.fee : ''}
                        paymentAPI={paymentDetails?.source === 'payNow' ? paymentDetails?.paymentAPI : ''}
                        payeeEmail={paymentDetails?.source === 'payNow' ? paymentDetails?.payeeEmail : ''}
                        payeeName={paymentDetails?.source === 'payNow' ? paymentDetails?.payeeName : ''}
                        primaryButton={{
                            text: paymentDetails?.source === 'payNow' ? (
                                <a href={paymentDetails.checkoutURL} rel="noopener noreferrer">
                                    <button className="w-[70%] h-[30px] bg-[#FFC300] text-black rounded-[8px] text-[14px]">
                                        {paymutateLoading ? "Paying" : "Pay Now"}
                                    </button>
                                </a>
                            ) : (
                                <button className="w-[70%] h-[30px] bg-[#FFC300]  text-black rounded-[8px] text-[14px] " onClick={() => handlePayment(paymentDetails.paymentID)}>
                                    Continue
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
            {isProductModalOpen && selectedProduct && (
                <Modal onClose={() => setIsProductModalOpen(false)}>
                    <div className="flex w-full gap-2 max-[650px]:flex-col max-[650px]:w-full overflow-scroll">
                        <span className='w-[50%] flex items-center justify-center max-[650px]:w-full'>
                            <img src={selectedProduct.productImage} alt={selectedProduct.productName} className="object-cover w-full aspect-square" />
                        </span>
                        <div className='w-[50%] flex flex-col gap-2 max-[650px]:w-full mt-[20px]'>
                            <div className='w-full h-[20%] gap-2 flex flex-col justify-end max-[650px]:h-auto'>
                                <h2 className="text-[14px] mb-1 pb-2 flex items-center border-b border-lightgrey">
                                    {selectedProduct.pages ? <p>E-book</p> : <p>Course</p>}
                                </h2>
                                <h2 className="text-[20px] w-full max-[650px]:text-[15px]">{selectedProduct.productName}</h2>
                            </div>
                            <div className='prose h-[30%] max-[650px]:w-full max-[650px]:text-[12px] text-[#000000c1] text-[14px]' dangerouslySetInnerHTML={{ __html: selectedProduct?.productDescription?.slice(0, 80) }} />
                            {selectedProduct.pages ? (
                                <div className='h-[50%] max-[650px]:mt-[20px] max-[650px]:text-[14px]  max-[650px]:h-auto flex flex-col gap-3 justify-center max-[650px]:w-full'>
                                    <p>E-book Details</p>
                                    <span className='flex items-center gap-2'>
                                        <RiPagesLine />
                                        <p>Pages: {selectedProduct?.pages}</p>
                                    </span>
                                    <span className='flex items-center gap-2'>
                                        <IoMdTime />
                                        <p>Duration: {selectedProduct?.duration}</p>
                                    </span>
                                    <span className='flex items-center gap-2'>
                                        <FiUser />
                                        <p>Author: {selectedProduct?.author}</p>
                                    </span>
                                </div>
                            ) : (
                                <div className='h-[50%]  max-[650px]:h-auto gap-2 flex flex-col justify-center max-[650px]:w-full'>
                                    <p>Course Details</p>
                                    <span className='flex items-center gap-2'>
                                        <IoMdTime />
                                        <p>Duration: {selectedProduct?.duration}</p>
                                    </span>
                                    <span className='flex items-center gap-2'>
                                        <FiUser />
                                        <p>Author: {selectedProduct?.author}</p>
                                    </span>
                                </div>
                            )}
                            <div className='flex w-full items-center justify-between mt-4'>
                                <span className='flex gap-2 items-center'>
                                    <CiMoneyCheck1 />
                                    <p>Amount: {selectedProduct?.paymentPrice}</p>
                                </span>
                                <button className=" bg-[#FFC300] w-[120px] text-[12px] h-[40px] rounded" onClick={() => navigate(`/home/details/${selectedProduct._id}`)}>
                                    View more Details
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}

        </div>
    );
}

export default Product;
