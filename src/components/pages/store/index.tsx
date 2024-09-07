import { useQuery } from "react-query";
import { getOneMerchantStoreProduct } from "../../../api/query";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/Auth";
import { useEffect, useState } from "react";
import { IProduct } from "../../../interface/ProductInterface";
import { CiMoneyCheck1 } from "react-icons/ci";
import { FiUser } from "react-icons/fi";
import { IoMdTime } from "react-icons/io";
import { RiPagesLine } from "react-icons/ri";
import Modal from "../../../utils/ProductModal";

const Store = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { isUserAuthenticated } = useAuth();
    const [allProduct, setAllProduct] = useState<IProduct[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);

    const searchParams = new URLSearchParams(location.search);
    const businessName = searchParams.get("businessName");

    const {
        data
    } = useQuery(
        ["getOneMerchantStoreProduct", businessName],
        () => getOneMerchantStoreProduct(businessName),
        {
            onSuccess: () => { },
            onError: () => { },
            enabled: !!businessName,
        }
    );

    const AdminInfo = data?.data?.data?.merchant[0];

    useEffect(() => {
        if (data && data.data && data.data.data) {
            const reversedData = [...data?.data?.data?.data].reverse();
            setAllProduct(reversedData);
        }
    }, [data]);

    const handleCartAddingAuth = () => {
        if (isUserAuthenticated) {
            alert('Are you sure you want to buy');
        } else {
            localStorage.setItem('redirectPath', location.pathname);
            navigate('/');
        }
    };
    const handleEyeClick = (product: IProduct) => {
        setSelectedProduct(product);
        setIsProductModalOpen(true);
        console.log(selectedProduct);
    };
    return (
        <div className="w-[100%] flex items-center justify-center flex-col gap-[20px] dark:text-white ">
            <div className="w-[50%] mt-[30px] h-[auto] p-[2%] shadow-lg shadow-grey-500/50 bg-slate-50  dark:bg-[#1D1C1C] dark:shadow-white-500/50 rounded-[16px]  max-[650px]:w-[90%] max-[650px]:p-[2%]">
                <div className="w-[60%] flex flex-col gap-[10px] max-[650px]:w-[100%] max-[650px]:items-center ">
                    <div className=" w-[100%] flex items-center gap-5 max-[650px]:flex-col">
                        <span className="flex w-[70%] flex-col items-center gap-[10px] relative">
                            <img src={AdminInfo?.image} alt="" className="w-[150px] h-[150px] rounded-[100%] object-cover max-[650px]:w-[80px] max-[650px]:h-[80px] " />
                            {/* {
                            allProduct.length > 1 ?  <BiBadgeCheck className="absolute right-[68px] text-[20px] top-[55px] text-[#FFc300]"/>: null
                           } */}
                            <p className="text-[15px] font-bold hidden max-[650px]:flex ">{AdminInfo?.profession}</p>
                        </span>
                        <span className="h-[100px] w-[100%] gap-5 max-[650px]:w-[100%] max-[650px]:flex max-[650px]:items-center max-[650px]:flex-col">
                            {
                                AdminInfo?.business_name && <p className="text-clamp text-[25px] mb-[10px]">@{AdminInfo?.business_name}</p>
                            }
                            <p className="text-[12px] max-[650px]:text-center">{AdminInfo?.bio}</p>
                        </span>
                    </div>
                    <div className="w-[100%] flex  items-center ">
                        <p className="text-[12px] font-bold max-[650px]:hidden ">{AdminInfo?.profession}</p>
                    </div>
                </div>
            </div>
            <div className="w-[70%] mb-[70px] flex flex-wrap justify-center gap-[20px] max-[650px]:justify-center max-[650px]:w-[100%]">
                {
                    allProduct?.map((i: IProduct) => (
                        <div className="w-[200px] border flex flex-col items-center p-[10px] gap-[10px] max-[650px]:w-[150px] rounded-[8px]">
                            <img onClick={() => handleEyeClick(i)} src={i?.productImage} alt="" className="w-[100%] h-[200px] object-cover aspect-square " />
                            <span className="w-full">
                                <p className="max-[650px]:text-[12px] h-[40px] text-[14px]">{i?.productName}</p>
                            </span>
                            <button className="w-full p-[2px] bg-[#FFC300] rounded-[4px]" onClick={handleCartAddingAuth}>Buy now</button>
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
                            <div className='prose h-[30%] max-[650px]:w-full max-[650px]:text-[12px] text-[lightgrey] text-[14px]' dangerouslySetInnerHTML={{ __html: selectedProduct?.productDescription?.slice(0, 80) }} />
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
};

export default Store;
