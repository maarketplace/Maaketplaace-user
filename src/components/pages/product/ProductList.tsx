import { useProductActions } from '../../../hooks/useProductAction';
import { usePaymentActions } from '../../../hooks/usePaymentActions';
import { useUser } from '../../../context/GetUser';
import { IProduct } from '../../../interface/ProductInterface';
import ProductReels from '../reels';
import ProductCard from './ProductCard';
import PaymentModal from '../../../utils/PaymentModal';

interface ProductGridProps {
    products: IProduct[];
    onProductView: (product: IProduct) => void;
}

function ProductGrid({ products, onProductView }: ProductGridProps) {
    const { user } = useUser();
    const loggedInUserId = user?._id;
    const isUserAuthenticated = !!user;

    const {
        isModalOpen,
        setIsModalOpen,
        paymentDetails,
        setPaymentDetails,
        payLoadingState,
        iframeRef,
        handleCheckout,
        handlePayment
    } = usePaymentActions();

    const {
        handleLike,
        handleFollow,
        handleBuyNow,
        loadingStates,
        isBuyLoading,
        isFollowLoading
    } = useProductActions(
        products,
        () => { },
        loggedInUserId,
        setPaymentDetails,
        setIsModalOpen,
        isUserAuthenticated
    );

    return (
        <div className="space-y-8">
            <p className="mt-4 mb-6 w-full text-lg text-[#ffc300] font-semibold">Quicks</p>

            <ProductReels />

            <p className="mt-4 mb-6 w-full text-lg text-[#ffc300] font-semibold">All Products</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product: IProduct) => (
                    <ProductCard
                        key={product._id}
                        product={product}
                        onLike={handleLike}
                        onFollow={handleFollow}
                        onBuyNow={handleBuyNow}
                        onView={onProductView}
                        loadingStates={loadingStates}
                        loadingBuy={isBuyLoading(product._id)}
                        loadingFollow={isFollowLoading(product.merchant?._id || '')}
                        loadingLike={false}
                    />
                ))}
            </div>

            {isModalOpen && (
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
                                className="w-[70%] h-[30px] bg-[#FFC300] text-black rounded-[8px] text-[14px]"
                                onClick={handleCheckout}
                            >
                                Pay Now
                            </button>
                        ) : (
                            <button
                                className="w-[70%] h-[30px] bg-[#FFC300] text-black rounded-[8px] text-[14px]"
                                onClick={() => {
                                    handlePayment(paymentDetails?.paymentID)
                                    console.log('Payment ID from details:', paymentDetails.paymentID);
                                }}
                            >
                                {payLoadingState[paymentDetails.paymentID] ? <span>Loading...</span> : 'Continue'}
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
            )}

            {paymentDetails.checkoutURL && (
                <iframe
                    ref={iframeRef}
                    src={paymentDetails.checkoutURL}
                    className="fixed inset-0 w-full h-full z-50"
                    style={{ display: 'none' }}
                    title="Payment Checkout"
                />
            )}
        </div>
    );
}

export default ProductGrid;