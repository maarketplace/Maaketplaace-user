import { useMutation, useQuery } from "react-query";
import { getOneMerchantStoreProduct } from "../../../api/query";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../context/Auth";
import { useEffect, useState, useRef } from "react";
import { IProduct } from "../../../interface/ProductInterface";
import { CiMoneyCheck1 } from "react-icons/ci";
import { FiUser, FiShare2, FiEye } from "react-icons/fi";
import { IoMdTime } from "react-icons/io";
import { RiPagesLine } from "react-icons/ri";
import { HiOutlineUsers } from "react-icons/hi";
import { BiPackage } from "react-icons/bi";
import Modal from "../../../utils/ProductModal";
import { userBuyNow, userPayWithKora } from "../../../api/mutation";
import { handleBuyNow, handlePayNow } from "../../../utils/PaymentComponent";
import PaymentModal from "../../../utils/PaymentModal";
import Loading from "../../../loader";
import { copyToClipboard } from "../../../utils/Utils";

const Store = () => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const navigate = useNavigate();
    const { isUserAuthenticated } = useAuth();
    const [allProduct, setAllProduct] = useState<IProduct[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [shareSuccess, setShareSuccess] = useState(false);
    const { businessName } = useParams<{ businessName?: string }>()
    const decodedName = businessName?.replace(/-/g, " ");
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
    const [payLoadingState, setPayLoadingStates] = useState<Record<string, boolean>>({});

    const {
        data,
        isLoading,
        error
    } = useQuery(
        ["getOneMerchantStoreProduct", decodedName],
        () => getOneMerchantStoreProduct(decodedName || null),
        {
            onSuccess: () => { },
            onError: () => { },
            enabled: !!businessName,
            refetchOnWindowFocus: false,
        }
    );

    const { mutate: buyMutate } = useMutation(['buynow'], userBuyNow);

    const handleCartAddingAuth = (id: string) => {
        handleBuyNow(id, isUserAuthenticated, setLoadingStates, setPaymentDetails, setIsModalOpen, buyMutate, navigate);
    };

    const { mutate: payNowMutate } = useMutation(['paynow'], userPayWithKora);

    const handlePayment = (paymentID: string) => {
        handlePayNow(payNowMutate, paymentID, setPaymentDetails, setIsModalOpen, setPayLoadingStates);
    };

    const AdminInfo = data?.data?.data?.merchant[0];

    useEffect(() => {
        if (data && data.data && data.data.data) {
            const reversedData = [...data.data.data.data].reverse();
            setAllProduct(reversedData);
        }
    }, [data]);

    const handleEyeClick = (product: IProduct) => {
        setSelectedProduct(product);
        setIsProductModalOpen(true);
    };

    const handleCheckout = () => {
        if (paymentDetails.amount === '₦0') {
            navigate('/free-order-summary');
            return;
        } else {
            if (iframeRef.current) {
                iframeRef.current.style.display = 'block';
                iframeRef.current.src = paymentDetails.checkoutURL;
            }
        }
    };

    const handleShareStore = async () => {
        const storeUrl = `https://maarketplaace.com/store/${businessName}`;
        await copyToClipboard(storeUrl);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2000);
    };

    useEffect(() => {
        if (!paymentDetails.checkoutURL) {
            return;
        }
        const handleResponse = (event: { origin: string; data: string }) => {
            if (event.origin === new URL(paymentDetails.checkoutURL).origin) {
                const parsedData = JSON.parse(event.data);
                const paymentData = parsedData.data;
                if (paymentData && paymentData.reference) {
                    localStorage.setItem('orderRefrence', paymentData.reference);
                }
                const result = parsedData.result;
                switch (result) {
                    case 'success':
                        console.log('Payment successful, redirecting to success page...');
                        navigate('/order-success')
                        break;
                    case 'failed':
                        navigate('/order-failure')
                        break;
                    case 'pending':
                        break;
                    default:
                        navigate('/order-failure')
                        break;
                }
            }
        };
        window.addEventListener('message', handleResponse);
        return () => {
            window.removeEventListener('message', handleResponse);
        };
    }, [navigate, paymentDetails.checkoutURL, setIsModalOpen]);

    // Loading state
    if (isLoading) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loading />
                    <p className="text-gray-600 dark:text-gray-400">Loading store...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Store not found</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">The store you're looking for doesn't exist or has been removed.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-4 py-2 bg-[#FFC300] text-black rounded-lg hover:bg-[#FFD700] transition-colors"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black py-8 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-black rounded-2xl shadow-sm shadow-gray-400 overflow-hidden mb-8">
                    <div className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="flex-shrink-0">
                                <div className="relative">
                                    <img
                                        src={AdminInfo?.image}
                                        alt={AdminInfo?.business_name}
                                        className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-lg"
                                    />
                                    <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-2 border-white"></div>
                                </div>
                            </div>

                            <div className="flex-1 text-center md:text-left">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                    {AdminInfo?.business_name}
                                </h1>
                                <p className="text-sm font-medium text-[#FFC300] mb-3">
                                    {AdminInfo?.profession}
                                </p>
                                <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base leading-relaxed max-w-2xl">
                                    {AdminInfo?.bio}
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                                <div className="text-center">
                                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg mb-2">
                                        <HiOutlineUsers className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {AdminInfo?.followedUsers?.length || 0}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Followers</p>
                                </div>
                                <div className="text-center">
                                    <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg mb-2">
                                        <BiPackage className="w-6 h-6 text-green-600 dark:text-green-400" />
                                    </div>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {allProduct?.length || 0}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Products</p>
                                </div>
                                <div className="text-center">
                                    <button
                                        onClick={handleShareStore}
                                        className="flex items-center justify-center w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg mb-2 hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors"
                                    >
                                        <FiShare2 className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                                    </button>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {shareSuccess ? 'Copied!' : 'Share'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                        Products ({allProduct?.length || 0})
                    </h2>

                    {allProduct?.length === 0 ? (
                        <div className="text-center py-12">
                            <BiPackage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No products yet</h3>
                            <p className="text-gray-600 dark:text-gray-400">This store hasn't added any products yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {allProduct?.map((product: IProduct) => (
                                <div
                                    key={product._id}
                                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
                                >
                                    <div className="relative">
                                        <img
                                            src={product?.productImage}
                                            alt={product?.productName}
                                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <button
                                            onClick={() => handleEyeClick(product)}
                                            className="absolute top-3 right-3 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                        >
                                            <FiEye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                        </button>
                                        <div className="absolute top-3 left-3">
                                            <span className="px-2 py-1 bg-[#FFC300] text-black text-xs font-medium rounded-full">
                                                {product.pages ? 'E-book' : 'Course'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-medium text-gray-900 dark:text-white text-sm mb-2 line-clamp-2 h-10">
                                            {product?.productName}
                                        </h3>
                                        <p className="text-lg font-semibold text-[#FFC300] mb-3">
                                            ₦{product?.paymentPrice}
                                        </p>
                                        <button
                                            onClick={() => handleCartAddingAuth(product?._id)}
                                            disabled={loadingStates[product?._id]}
                                            className="w-full py-2.5 bg-[#FFC300] hover:bg-[#FFD700] text-black font-medium rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                        >
                                            {loadingStates[product?._id] ? <Loading /> : 'Buy Now'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {isProductModalOpen && selectedProduct && (
                <Modal onClose={() => setIsProductModalOpen(false)}>
                    <div className="max-w-4xl mx-auto bg-white dark:bg-black rounded-2xl overflow-hidden">
                        <div className="flex flex-col lg:flex-row">
                            <div className="lg:w-1/2">
                                <img
                                    src={selectedProduct.productImage}
                                    alt={selectedProduct.productName}
                                    className="w-full h-64 lg:h-full object-cover"
                                />
                            </div>

                            <div className="lg:w-1/2 p-6">
                                <div className="mb-4">
                                    <span className="inline-block px-3 py-1 bg-[#FFC300] text-black text-sm font-medium rounded-full mb-3">
                                        {selectedProduct.pages ? 'E-book' : 'Course'}
                                    </span>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                                        {selectedProduct.productName}
                                    </h2>
                                </div>

                                <div className="prose dark:prose-invert text-sm mb-6">
                                    <div dangerouslySetInnerHTML={{
                                        __html: selectedProduct?.productDescription?.slice(0, 200) + '...'
                                    }} />
                                </div>

                                <div className="space-y-3 mb-6">
                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                        {selectedProduct.pages ? 'E-book Details' : 'Course Details'}
                                    </h3>

                                    {selectedProduct.pages && (
                                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                            <RiPagesLine className="w-4 h-4" />
                                            <span>Pages: {selectedProduct?.pages}</span>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                        <IoMdTime className="w-4 h-4" />
                                        <span>Duration: {selectedProduct?.duration}</span>
                                    </div>

                                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                        <FiUser className="w-4 h-4" />
                                        <span>Author: {selectedProduct?.author}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center gap-2">
                                        <CiMoneyCheck1 className="w-5 h-5 text-[#FFC300]" />
                                        <span className="text-xl font-bold text-[#FFC300]">
                                            {selectedProduct?.paymentPrice}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => navigate(`/details/${selectedProduct._id}`)}
                                        className="px-6 py-2.5 bg-[#FFC300] hover:bg-[#FFD700] text-black font-medium rounded-lg transition-colors duration-300"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50">
                    <iframe
                        ref={iframeRef}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100vh',
                            display: 'none',
                            zIndex: 1000000,
                            backgroundColor: 'white'
                        }}
                        title="Payment Checkout"
                    />
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
                                <button
                                    className="w-full py-3 bg-[#FFC300] hover:bg-[#FFD700] text-black font-medium rounded-lg transition-colors duration-300"
                                    onClick={handleCheckout}
                                >
                                    Pay Now
                                </button>
                            ) : (
                                <button
                                    className="w-full py-3 bg-[#FFC300] hover:bg-[#FFD700] text-black font-medium rounded-lg transition-colors duration-300 disabled:opacity-50"
                                    onClick={() => handlePayment(paymentDetails.paymentID)}
                                    disabled={payLoadingState[paymentDetails.paymentID]}
                                >
                                    {payLoadingState[paymentDetails.paymentID] ? <Loading /> : 'Continue'}
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
            )}
        </div>
    );
};

export default Store;