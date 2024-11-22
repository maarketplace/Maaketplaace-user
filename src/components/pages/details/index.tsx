import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom"
import { getOneProduct } from "../../../api/query";
import { IProduct } from "../../../interface/ProductInterface";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Mousewheel, Pagination } from 'swiper/modules';
import { useEffect, useRef, useState } from "react";
import { FiUser } from "react-icons/fi";
import { IoMdTime } from "react-icons/io";
import { RiPagesLine } from "react-icons/ri";
import { BsDot } from "react-icons/bs";
import { userBuyNow, userPayWithKora } from "../../../api/mutation";
import { handleBuyNow, handlePayNow } from "../../../utils/PaymentComponent";
import PaymentModal from "../../../utils/PaymentModal";
import { useAuth } from "../../../context/Auth";
import Loading from "../../../loader";

const Details = () => {
    const iframeRef = useRef(null);
    const navigate = useNavigate();
    const { isUserAuthenticated } = useAuth();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { id: productIdParam } = useParams<{ id?: any }>();
    const [product, setProduct] = useState<IProduct | null>(null)
    const { data } = useQuery(['getoneproduct', productIdParam], () => getOneProduct(productIdParam), {})
    const [activeTab, setActiveTab] = useState('expect');
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

    const relatedProduct = data?.data?.data?.data?.related_product
    useEffect(() => {
        setProduct(data?.data?.data?.data?.product?.[0])
    }, [data])

    const { mutate: buyMutate } = useMutation(['buynow'], userBuyNow,);

    const handleCartAddingAuth = (id: string) => {
        handleBuyNow(id, isUserAuthenticated, setLoadingStates, setPaymentDetails, setIsModalOpen, buyMutate, navigate);
    };

    const { mutate: payNowMutate } = useMutation(['paynow'], userPayWithKora);

    const handlePayment = (paymentID: string) => {
        handlePayNow(payNowMutate, paymentID, setPaymentDetails, setIsModalOpen);
    };
    const handleCheckout = () => {
        if (paymentDetails.amount === '₦0') {
            navigate('/home/free-order-summary');
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
            console.log("Checkout URL is not set yet.");
            return;
        }
        console.log("Checkout URL is set");

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
                        navigate('/home/order-success')
                        break;

                    case 'failued':
                        navigate('/home/order-failure')
                        break;

                    case 'pending':

                        break;

                    default:
                        console.log('Unknown result, handling default case...');
                        navigate('/home/order-failure')
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
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <div className="w-full h-full text-[15px] mt-[100px] flex flex-col items-center max-[650px]:mt-[40px]">
            <div className="w-[90%] flex gap-[10px] max-[650px]:flex-col max-[650px]:w-[100%]">
                <div className="w-[30%]  max-[650px]:h-[550px]  flex flex-col items-center p-[10px] gap-[10px] max-[650px]:w-full max-[650px]:mt-[40px]">
                    <div className='w-[70%] h-[250px] flex items-center justify-center '>
                        <img src={product?.productImage} className='w-[100%] object-cover  aspect-square max-[650px]:h-[90%] ' />
                    </div>
                    <div className="flex w-full items-center gap-[5px] mt-[10px]">
                        <span className="w-[20%]">
                            <img src={product?.merchant?.image} alt="" className="w-[40px] h-[40px] rounded-full object-cover filter brightness-225 contrast-110 transition-all duration-500 ease-in-out" />
                        </span>
                        <p className=" w-[100%] max-[650px]:w-[80%] text-[12px] text-wrap">{product?.productName}</p>
                    </div>
                    {product?.pages ? (
                        <div className='w-[100%] h-[50%] max-[650px]:mt-[20px] max-[650px]:text-[14px]  max-[650px]:h-auto flex flex-col gap-3 justify-center max-[650px]:w-full'>
                            <span className='flex items-center gap-2'>
                                <BsDot className="text-[#FFC300] text-[30px]" />
                                <RiPagesLine />
                                <p>Pages: {product?.pages}</p>
                            </span>
                            <span className='flex items-center gap-2'>
                                <BsDot className="text-[#FFC300] text-[30px]" />
                                <IoMdTime />
                                <p>Duration: {product?.duration}</p>
                                {/* <BsDot className="text-[#FFC300] text-[30px]" /> */}
                            </span>
                            <span className='flex items-center gap-2'>
                                <BsDot className="text-[#FFC300] text-[30px]" />
                                <FiUser />
                                <p>Author: {product?.author}</p>
                            </span>
                        </div>
                    ) : (
                        <div className='h-[50%] w-[100%]  max-[650px]:h-auto gap-2 flex flex-col justify-center max-[650px]:w-full'>
                            <span className='flex items-center gap-2'>
                                <BsDot className="text-[#FFC300] text-[30px]" />
                                <IoMdTime />
                                <p>Duration: {product?.duration}</p>
                            </span>
                            <span className='flex items-center gap-2'>
                                <BsDot className="text-[#FFC300] text-[30px]" />
                                <FiUser />
                                <p>Author: {product?.author}</p>
                            </span>
                            <span className='flex items-center gap-2'>
                                <BsDot className="text-[#FFC300] text-[30px]" />
                                {/* <FiUser /> */}
                                <p>Learn at your own pace</p>
                            </span>
                        </div>
                    )}
                    {
                        product?.pages ?
                            <div className="w-[90%]">
                                <button className=" bg-[#FFC300] text-black w-[100%] text-[12px] h-[40px] rounded" onClick={() => handleCartAddingAuth(product?._id)}>
                                    {loadingStates[product?._id] ? <Loading /> : ' Pay for this Book'}
                                </button>
                            </div>
                            : <div className="w-[90%]">
                                <button className=" bg-[#FFC300] text-black w-[100%] text-[12px] h-[40px] rounded" onClick={() => handleCartAddingAuth(product?._id as string)}>
                                    {product && loadingStates[product?._id] ? <Loading /> : ' Pay for this Course'}
                                </button>
                            </div>
                    }
                </div>
                <div className="w-[50%] max-[650px]:w-[100%] dark:bg-black p-[20px] flex flex-col gap-[20px] max-[650px]:p-[10px]">
                    <div className="w-full  flex flex-col gap-[10px]">
                        <p className="w-[100%] text-[20px]">{product?.productName}</p>
                        {product?.productDescription && (
                            <div
                                className="prose dark:prose-invert text-[14px] flex flex-wrap text-black dark:text-white max-[650px]:text-[12px]"
                                dangerouslySetInnerHTML={{ __html: product?.productDescription }}
                            />
                        )}
                    </div>
                    {product?.pages ? null : (
                        <div className="w-full bg-slate-50 p-[20px] dark:bg-black max-[650px]:p-[5px] flex flex-col gap-[10px]">
                            {/* Tab Buttons */}
                            <div className="flex gap-[10px]">
                                <button
                                    className={`${activeTab === 'expect' ? 'text-[#FFC300]' : 'text-gray-500'
                                        }`}
                                    onClick={() => setActiveTab('expect')}
                                >
                                    What to Expect
                                </button>
                                <button
                                    className={`${activeTab === 'topics' ? 'text-[#FFC300]' : 'text-gray-500'
                                        }`}
                                    onClick={() => setActiveTab('topics')}
                                >
                                    Topics
                                </button>
                            </div>
                            {activeTab === 'topics' && (
                                <div className="p-[10px] h-[200px]">
                                    {product?.topics && (
                                        <div className="prose text-[14px] flex flex-wrap text-black dark:text-white max-[650px]:text-[12px]"
                                            dangerouslySetInnerHTML={{ __html: product?.topics }}

                                        />
                                    )}
                                </div>
                            )}

                            {activeTab === 'expect' && (
                                <div className="p-[10px]">
                                    {product?.whatToExpect && (
                                        <div
                                            className="prose dark:prose-invert text-[14px] flex flex-wrap text-black dark:text-white max-[650px]:text-[12px] m-0 p-0"
                                            dangerouslySetInnerHTML={{ __html: product?.whatToExpect }}
                                            style={{ margin: 0, padding: 0 }}
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <div className="w-[100%] mt-[20px]  mb-[120px] flex flex-col items-center gap-[20px] ">
                <p className=" w-[90%] text-[20px]">Recommended Product</p>
                <div className="w-[100%] p-0 flex flex-wrap gap-[10px] max-[650px]:w-full ">
                    <Swiper
                        direction="horizontal"
                        spaceBetween={30}
                        mousewheel={true}
                        modules={[Mousewheel, Pagination]}
                        className="w-[90%]"
                        style={{ padding: "10px", }}
                        breakpoints={{
                            1024: {
                                slidesPerView: 4,
                                spaceBetween: 30,
                            },
                            768: {
                                slidesPerView: 2,
                                spaceBetween: 20,
                            },
                            650: {
                                slidesPerView: 1,
                                spaceBetween: 10,
                            },
                        }}
                    >
                        {relatedProduct?.map((i: IProduct) => (
                            <SwiperSlide
                                key={i?._id}
                                style={{ height: 400 }}
                                onClick={() => navigate(`/home/details/${i._id}`)}
                                className="h-[450px] border rounded-lg p-[10px] flex flex-col gap-[20px] max-[650px]:border-none max-[650px]:bg-slate-50 dark:bg-black dark:shadow-sm dark:shadow-[lightgrey] max-[650px]:w-[100%] max-[650px]:rounded-none "
                            >
                                <div className="h-[250px] flex items-center justify-center mb-[10px] max-[650px]:w-full max-[650px]:h-[250px]">
                                    <img
                                        src={i?.productImage}
                                        className="w-[100%] h-[100%] "
                                    />
                                </div>
                                <span className="">
                                    <p className="text-[15px]" >{i?.productName?.slice(0, 50)}</p>
                                </span>
                                <span className="flex gap-[10px]">
                                    <p className="text-[15px] line-through text-[lightgrey]">
                                        ₦{i?.productPrice}
                                    </p>
                                    <p className="text-[15px]">₦{i?.paymentPrice}</p>
                                </span>
                                <span className="flex gap-[10px] text-[12px]">
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: i?.productDescription?.slice(0, 30),
                                        }}
                                    />
                                </span>
                                <div className="w-[100%] flex flex-col">
                                    <div className="flex items-center w-[100%] h-[50px]">
                                        <button className="w-[40%] h-[30px] bg-[#FFC300] text-black rounded-[8px] text-[15px]" onClick={() => handleCartAddingAuth(i?._id)}>
                                            {loadingStates[i?._id] ? <Loading /> : 'Buy Now'}
                                        </button>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                </div>
            </div>
            <div className="">

            </div>
            {
                isModalOpen && (
                    <div className='w-full h-full bottom-2 fixed z-10'>
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
                                        className="w-[70%] h-[30px] bg-[#FFC300] text-black rounded-[8px] text-[14px]"
                                        onClick={handleCheckout}
                                    >
                                        Pay Now
                                    </button>
                                ) : (
                                    <button className="w-[70%] h-[30px] bg-[#FFC300] text-black rounded-[8px] text-[14px]" onClick={() => handlePayment(paymentDetails.paymentID)}>
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
                )
            }
        </div>
    )
}

export default Details