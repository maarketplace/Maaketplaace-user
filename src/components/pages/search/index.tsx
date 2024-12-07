import { useContext, useEffect, useState } from "react";
import { SearchContext } from "../../../context/Search";
import { useQuery } from "react-query";
import { getAllProduct } from "../../../api/query";
import { IProduct } from "../../../interface/ProductInterface";
import { CiMoneyCheck1 } from "react-icons/ci";
import { FiUser } from "react-icons/fi";
import { IoMdTime } from "react-icons/io";
import { RiPagesLine } from "react-icons/ri";
import Modal from "../../../utils/ProductModal";
import { IoEyeOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Search = () => {
    const navigate = useNavigate();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [allProduct, setAllProduct] = useState<any>([]);
    const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);


    const {
        data: allProductData, isLoading
    } = useQuery(["getallproduct"], getAllProduct);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    useEffect(() => {
        if (allProductData?.data?.data?.products) {
            const reversedData = [...allProductData.data.data.products].reverse();
            setAllProduct(reversedData);
        }
    }, [allProductData]);
    const context = useContext(SearchContext);

    if (!context) {
        return null;
    }

    const { searchQuery, setSearchQuery } = context;

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };
    const filteredProducts = allProduct?.filter((product: IProduct) =>
        product?.productName?.toLowerCase().includes(searchQuery?.trim().toLowerCase()) ||
        product?.merchant?.business_name.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
        product?.merchant?.fullName.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );
    const handleEyeClick = (product: IProduct) => {
        setSelectedProduct(product);
        setIsProductModalOpen(true);
        console.log(selectedProduct);
    };

    return (
        <div className="mt-[20px] w-full h-full max-[650px]:mt-[40px] hidden max-[650px]:flex max-[650px]:flex-col no-scrollbar">
            <div className="w-[full] flex justify-center">
                <input
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-[60%] py-[5px] px-[10px] outline-none rounded-[4px] border border-[#434343] max-[650px]:w-[90%] bg-transparent"
                    placeholder="Search here"
                />
            </div>
            <div className="w-full flex justify-center no-scrollbar">
                {
                    isLoading ?
                        <div className="w-[100%] h-[80vh] flex justify-center">
                            <p>Loading Product....</p>
                        </div>
                        :
                        filteredProducts?.length !== 0
                            ?
                            <div className="w-[95%] h-[] mt-[20px] p-0 grid grid-cols-2 items-center gap-5 max-[650px]:gap-0 mb-[80px]  max-[650px]:mb-[60px] no-scrollbar ">
                                {filteredProducts?.map((i: IProduct) => (
                                    <div key={i?._id} className='w-[300px] h-[500px] dark:shadow-[white] rounded-lg p-[10px] flex flex-col gap-[10px] dark:bg-black dark:text-white max-[650px]:border-none max-[650px]:bg-slate-50 max-[650px]:w-[100%] max-[650px]:rounded-none max-[650px]:h-auto' >
                                        <div className='w-[100%] relative flex items-center justify-center mb-[10px]'>
                                            <img src={i?.productImage} className='w-[100%] object-cover aspect-square filter brightness-225 contrast-110 transition-all duration-500 ease-in-out' />
                                            <div
                                                className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity'
                                                onClick={() => handleEyeClick(i)}
                                            >
                                                <IoEyeOutline size={30} className='text-white cursor-pointer' />
                                            </div>
                                        </div>
                                        <span >
                                            <p className='text-[15px] truncate'>{i?.productName} </p>
                                        </span>
                                        <span className='flex gap-[10px]'>
                                            <p className='text-[12px] line-through text-[lightgrey]'>₦{i?.productPrice}</p>
                                            <p className='text-[12px]'>₦{i?.paymentPrice}</p>
                                        </span>
                                    </div>
                                ))}
                            </div>
                            :
                            <div className='w-[100%] h-[80vh] flex items-center justify-center'>
                                <p>No product available yet</p>
                            </div>
                }
            </div>
            {isProductModalOpen && selectedProduct && (
                <Modal onClose={() => setIsProductModalOpen(false)}>
                    <div className="flex w-full gap-2 max-[650px]:flex-col max-[650px]:w-full overflow-auto no-scrollbar">
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
                            <div className='prose h-[30%] max-[650px]:w-full max-[650px]:text-[10px] text-[#000000c1] dark:text-white text-[14px]' dangerouslySetInnerHTML={{ __html: selectedProduct?.productDescription?.slice(0, 80) }} />
                            {selectedProduct.pages ? (
                                <div className='h-[50%] max-[650px]:mt-[20px] max-[650px]:text-[12px]  max-[650px]:h-auto flex flex-col gap-3 justify-center max-[650px]:w-full'>
                                    <p>E-book Details</p>
                                    <span className='flex items-center gap-2 text-[12px]'>
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
                                <div className='h-[50%]  max-[650px]:h-auto gap-2 flex flex-col max-[650px]:text-[12px] justify-center max-[650px]:w-full'>
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
                                <span className='flex gap-2 items-center max-[650px]:text-[12px]'>
                                    <CiMoneyCheck1 />
                                    <p>Amount: {selectedProduct?.paymentPrice}</p>
                                </span>
                                <button className=" bg-[#FFC300] w-[120px] text-[12px] h-[40px] rounded max-[650px]:w-[100px] max-[650px]:h-[30px] text-black " onClick={() => navigate(`/details/${selectedProduct._id}`)}>
                                    View more 
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    )
}

export default Search