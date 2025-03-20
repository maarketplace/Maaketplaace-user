import { useMutation, useQuery } from "react-query";
import { getOneMerchantStoreProduct } from "../../../api/query";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../context/Auth";
import { useEffect, useState, useRef } from "react";
import { IProduct } from "../../../interface/ProductInterface";
import { CiMoneyCheck1 } from "react-icons/ci";
import { FiUser } from "react-icons/fi";
import { IoMdTime } from "react-icons/io";
import { RiPagesLine } from "react-icons/ri";
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
        data
    } = useQuery(
        ["getOneMerchantStoreProduct", decodedName],
        () => getOneMerchantStoreProduct(decodedName || null),
        {
            onSuccess: () => { },
            onError: () => { },
            enabled: !!businessName,
        }
    );
    const { mutate: buyMutate } = useMutation(['buynow'], userBuyNow,);

    const handleCartAddingAuth = (id: string) => {
        handleBuyNow(id,isUserAuthenticated, setLoadingStates, setPaymentDetails, setIsModalOpen, buyMutate, navigate);
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

        // Cleanup the event listener when the component unmounts
        return () => {
            window.removeEventListener('message', handleResponse);
        };
    }, [navigate, paymentDetails.checkoutURL, setIsModalOpen]);
    return (
        <div className="w-[100%] flex items-center justify-center flex-col gap-[20px] dark:text-white ">
            <div className="w-[60%] mt-[30px] h-[auto] p-[2%] shadow-lg shadow-grey-500/50 bg-slate-50  dark:bg-[#1D1C1C] dark:shadow-white-500/50 rounded-[16px]  max-[650px]:w-[90%] max-[650px]:p-[2%] max-[320px]:h-[350px]">
                <div className="w-[100%] flex flex-col gap-[10px] max-[650px]:w-[100%] max-[650px]:items-center max-[650px]:h-[100%] ">
                    <div className=" w-[100%] flex items-center gap-5 max-[650px]:flex-col max-[650px]:h-[60%]">
                        <span className="flex w-[40%] flex-col items-center justify-center gap-[10px] relative max-[650px]:w-[100%]">
                            <img src={AdminInfo?.image} alt="" className="w-[150px] h-[150px] rounded-[100%] object-cover max-[650px]:w-[80px] max-[650px]:h-[80px] " />
                            <p className="text-[15px] font-bold hidden max-[650px]:flex max-[650px]:text-[14px] max-[650px]:text-center ">{AdminInfo?.profession}</p>
                        </span>
                        <span className=" w-[40%] gap-5 max-[650px]:w-[100%] max-[650px]:flex max-[650px]:items-center max-[650px]:flex-col">
                            {
                                AdminInfo?.business_name && <p className="text-clamp text-[25px] mb-[10px] max-[375px]:text-[18px] text-center">{AdminInfo?.business_name}</p>
                            }
                            <p className="text-[12px] max-[650px]:text-center">{AdminInfo?.bio}</p>
                        </span>
                        <span className="flex gap-2 w-[40%] justify-center max-[650px]:w-[100%]">
                            <p className="text-[12px] bg-[#eae7e7] p-1 rounded-[4px] dark:bg-[#2c2c2c]">{AdminInfo?.followedUsers?.length} Followers</p>
                            <p className="text-[12px] bg-[#eae7e7] p-1 rounded-[4px] dark:bg-[#2c2c2c]">{allProduct?.length} Product</p>
                            <p
                                className="text-[12px] bg-[#eae7e7] p-1 rounded-[4px] dark:bg-[#2c2c2c]"
                                onClick={() => copyToClipboard(`https://maarketplaace.com/store/${businessName}`)}
                            >
                                Share store
                            </p>
                        </span>
                    </div>
                    <div className="w-[30%] flex justify-center max-[650px]:w-[100%] ">
                        <p className="text-[12px] font-bold max-[650px]:hidden text-center ">{AdminInfo?.profession}</p>
                    </div>
                </div>
            </div>
            <div className="w-[70%] mb-[70px] flex flex-wrap gap-[20px] max-[650px]:gap-[10px] max-[650px]:w-[100%] max-[650px]:p-[10px] justify-center">
                {
                    allProduct?.map((i: IProduct) => (
                        <div className="w-[150px] max-[320px]:w-[90%] border dark:border-[grey] items-center p-[10px] gap-[10px] rounded-[8px]">
                            <img onClick={() => handleEyeClick(i)} src={i?.productImage} alt="" className="w-[100%] h-[200px] object-cover aspect-square" />
                                <p className="max-[650px]:text-[12px] h-[40px] text-[12px]">{i?.productName.slice(0, 35)}</p>
                            <button className="w-full p-[2px] bg-[#FFC300] rounded-[4px] text-black" onClick={() => handleCartAddingAuth(i?._id)}>{loadingStates[i?._id] ? <Loading /> : 'Buy now'} </button>
                        </div>
                    ))
                }
            </div>

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
                            <div className='prose h-[30%] max-[650px]:w-full max-[650px]:text-[12px] text-[white] text-[14px]' dangerouslySetInnerHTML={{ __html: selectedProduct?.productDescription?.slice(0, 80) }} />
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
                                <button className=" bg-[#FFC300] w-[120px] text-[12px] h-[40px] rounded text-black" onClick={() => navigate(`/details/${selectedProduct._id}`)}>
                                    View more Details
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
            {
                isModalOpen && (
                    <div className='w-full h-full bottom-2 fixed'>
                        <iframe
                            ref={iframeRef}
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '90vh',
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
                                        className="w-[70%] h-[30px] bg-[#FFC300] text-black rounded-[8px] text-[14px]"
                                        onClick={handleCheckout}
                                    >
                                        Pay Now
                                    </button>
                                ) : (
                                    <button className="w-[70%] h-[30px] bg-[#FFC300] text-black rounded-[8px] text-[14px]" onClick={() => handlePayment(paymentDetails.paymentID)}>
                                        {
                                            payLoadingState[paymentDetails.paymentID] ? <Loading/> : 'Continue'
                                        }
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
                )
            }
        </div>
    );
};

export default Store;
