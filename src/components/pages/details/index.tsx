import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from "react-query";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getOneProduct } from "../../../api/query";
import { userBuyNow, userPayWithKora } from "../../../api/mutation";
import { handleBuyNow, handlePayNow } from "../../../utils/PaymentComponent";
import PaymentModal from "../../../utils/PaymentModal";
import { useAuth } from "../../../context/Auth";
import { useUser } from '../../../context/GetUser';
import Loading from "../../../loader";
import toast from "react-hot-toast";
import { getCachedAuthData } from "../../../utils/auth.cache.utility";
import { IProduct } from "../../../interface/ProductInterface";
import { Breadcrumb } from './BreadCrumb';
import { ErrorState } from './ErrorState';
import { usePaymentModal } from './hooks/usePaymentModal';
import { LoadingState } from './LoadingState';
import { ProductImage } from './ProductImage';
import { PurchaseButton } from './ProductPurchaseButton';
import { RelatedProducts } from './RelatedProduct';
import { TabContent } from './TabContent';
import { ProductInfo } from './ProductInfo';


const Details: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isUserAuthenticated } = useAuth();
    const { id: productIdParam } = useParams<{ id?: string }>();
    const [product, setProduct] = useState<IProduct | null>(null);
    const { fetchUser } = useUser();
    const [activeTab, setActiveTab] = useState('expect');
    const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
    const [payLoadingState, setPayLoadingStates] = useState<Record<string, boolean>>({});

    const {
        iframeRef,
        isModalOpen,
        setIsModalOpen,
        paymentDetails,
        setPaymentDetails,
        handleCheckout,
    } = usePaymentModal();

    const { data, isLoading, error } = useQuery(
        ['getoneproduct', productIdParam],
        () => getOneProduct(productIdParam as string),
        {
            enabled: !!productIdParam,
        }
    );

    const relatedProduct = data?.data?.data?.data?.related_product;

    useEffect(() => {
        setProduct(data?.data?.data?.data?.product?.[0]);
    }, [data]);

    useEffect(() => {
        const getToken = getCachedAuthData();
        if (getToken !== null) {
            fetchUser().then(() => {
            }).catch(error => {
                toast.error(error?.message);
            });
        }
    }, [fetchUser]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const { mutate: buyMutate } = useMutation(['buynow'], userBuyNow);


    const handleBuyNowAction = (productId: string) => {
        const token = getCachedAuthData();

        if (!token) {
            localStorage.setItem("redirectPath", location.pathname);
            toast.error('Please login to complete your purchase');
            setTimeout(() => navigate('/login'), 2000);
            return;
        }

        if (setPaymentDetails && setIsModalOpen && isUserAuthenticated !== undefined) {
            handleBuyNow(
                productId,
                isUserAuthenticated,
                setLoadingStates,
                setPaymentDetails,
                setIsModalOpen,
                buyMutate,
                navigate
            );
        } else {
            buyMutate(productId);
        }
    };

    const { mutate: payNowMutate } = useMutation(['paynow'], userPayWithKora);

    const handlePayment = (paymentID: string) => {
        handlePayNow(payNowMutate, paymentID, setPaymentDetails, setIsModalOpen, setPayLoadingStates);
    };

    if (isLoading) {
        return <LoadingState />;
    }

    if (error || !product) {
        return <ErrorState onRetry={() => window.location.reload()} />;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black pt-20 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Breadcrumb
                    productName={product?.productName}
                    onNavigateHome={() => navigate('/')}
                    onNavigateProducts={() => navigate('/')}
                />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    <div className="space-y-6">
                        <ProductImage product={product} />
                        <ProductInfo product={product} />
                        <PurchaseButton
                            product={product}
                            loadingStates={loadingStates}
                            onPurchase={handleBuyNowAction}
                        />
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                {product?.productName}
                            </h1>
                            {product?.productDescription && (
                                <div
                                    className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
                                    dangerouslySetInnerHTML={{ __html: product?.productDescription }}
                                />
                            )}
                        </div>

                        {!product?.pages && (
                            <TabContent
                                product={product}
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                            />
                        )}
                    </div>
                </div>

                <RelatedProducts
                    products={relatedProduct}
                    loadingStates={loadingStates}
                    onPurchase={handleBuyNowAction}
                    onNavigate={(id) => navigate(`/details/${id}`)}
                />
            </div>

            {isModalOpen && (
                <div className='fixed inset-0 z-50'>
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
                            backgroundColor: 'white',
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
                                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 px-6 rounded-lg transition-colors"
                                    onClick={handleCheckout}
                                >
                                    Pay Now
                                </button>
                            ) : (
                                <button
                                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold h-8 px-6 rounded-lg transition-colors disabled:opacity-50"
                                    onClick={() => handlePayment(paymentDetails.paymentID)}
                                    disabled={payLoadingState[paymentDetails.paymentID]}
                                >
                                    {payLoadingState[paymentDetails.paymentID] ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <Loading />
                                            <span>Processing...</span>
                                        </div>
                                    ) : (
                                        'Continue'
                                    )}
                                </button>
                            ),
                            display: true,
                            primary: true,
                        }}
                        secondaryButton={{
                            text: "Cancel",
                            onClick: () => setIsModalOpen(false),
                            display: true,
                            primary: false,
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default Details;