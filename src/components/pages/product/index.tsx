import { useContext, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { getAllProduct } from '../../../api/query';
import { SearchContext } from '../../../context/Search';
import { IProduct } from '../../../interface/ProductInterface';
import ProductSkeleton from '../../../loader/productSkeleton';
import ProductGrid from './ProductList';
import { CiMoneyCheck1 } from 'react-icons/ci';
import { FiUser } from 'react-icons/fi';
import { IoMdTime } from 'react-icons/io';
import { RiPagesLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import Modal from '../../../utils/ProductModal';

function Product() {
    const context = useContext(SearchContext);
    const [allProduct, setAllProduct] = useState<IProduct[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const navigate = useNavigate()
    const {
        data: allProductData,
        isLoading,
    } = useQuery(
        ["getallproduct"],
        getAllProduct,
        {
            staleTime: 5 * 60 * 1000,
            cacheTime: 30 * 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 3,
        }
    );

    useEffect(() => {
        const reversedData = allProductData?.data?.data?.products ? [...allProductData.data.data.products].reverse() : [];
        setAllProduct([...reversedData]);
    }, [allProductData]);

    if (!context) return null;

    const { searchQuery } = context;
    const filteredProducts = allProduct?.filter((product: IProduct) =>
        product?.productName?.toLowerCase().includes(searchQuery?.trim().toLowerCase())
    );

    const handleProductView = (product: IProduct) => {
        setSelectedProduct(product);
        setIsProductModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-black dark:to-gray-800 p-4">
            <div className="max-w-7xl mx-auto">
                {isLoading ? (
                    <ProductSkeleton />
                ) : filteredProducts?.length !== 0 ? (
                    <ProductGrid
                        products={filteredProducts}
                        onProductView={handleProductView}
                    />
                ) : (
                    <div className="text-center py-20">
                        <p className="text-xl text-gray-500 dark:text-gray-400">No products found</p>
                    </div>
                )}
            </div>

            {isProductModalOpen && selectedProduct && (
                <Modal onClose={() => setIsProductModalOpen(false)}>
                    <div className="flex w-full gap-2 max-[650px]:flex-col max-[650px]:w-full overflow-auto no-scrollbar  ">
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
                            <div className='prose h-[30%] max-[650px]:w-full max-[650px]:text-[12px] text-[#000000c1] dark:text-white text-[14px]' dangerouslySetInnerHTML={{ __html: selectedProduct?.productDescription?.slice(0, 80) }} />
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
                                <button className=" bg-[#FFC300] text-black w-[120px] text-[12px] h-[30px] rounded" onClick={() => navigate(`/details/${selectedProduct._id}`)}>
                                    View more
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