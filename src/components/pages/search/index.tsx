import { useContext, useEffect, useState } from "react";
import { SearchContext } from "../../../context/Search";
import { useInfiniteQuery, useQuery } from "react-query";
import { getAllProduct, searchProduct } from "../../../api/query";
import { IProduct } from "../../../interface/ProductInterface";
import { CiMoneyCheck1 } from "react-icons/ci";
import { FiUser, FiChevronDown } from "react-icons/fi";
import { IoMdTime } from "react-icons/io";
import { RiPagesLine } from "react-icons/ri";
import Modal from "../../../utils/ProductModal";
import { IoEyeOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import ProductSkeleton from "../../../loader/productSkeleton";

type ProductType = 'all' | 'course' | 'ebook';

interface TabOption {
    key: ProductType;
    label: string;
    count?: number;
}

const Search = () => {
    const navigate = useNavigate();
    const context = useContext(SearchContext);
    const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<ProductType>('all');
    const LIMIT = 12;

    const { searchQuery = '', debouncedSearchQuery = '', isSearching = false, clearSearch = () => { } } = context || {};
    const hasSearchQuery = isSearching;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Regular product fetching (when no search)
    const {
        data: infiniteData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading: isLoadingInfinite,
    } = useInfiniteQuery(
        ['getAllProducts'],
        ({ pageParam = 1 }) => getAllProduct({
            page: pageParam,
            limit: LIMIT,
            random: false
        }),
        {
            getNextPageParam: (lastPage, allPages) => {
                const lastFetchedCount = lastPage?.data?.data?.products?.length || 0;

                if (lastFetchedCount < LIMIT) {
                    return undefined;
                }

                return allPages.length + 1;
            },
            staleTime: 5 * 60 * 1000,
            cacheTime: 30 * 60 * 1000,
            refetchOnWindowFocus: false,
            enabled: !hasSearchQuery,
        }
    );

    // Search query - always called but only enabled when searching
    const {
        data: searchData,
        isLoading: isLoadingSearch,
        error: searchError,
    } = useQuery(
        ['searchProducts', debouncedSearchQuery],
        () => searchProduct(1, 100, debouncedSearchQuery),
        {
            enabled: hasSearchQuery && !!debouncedSearchQuery,
            staleTime: 2 * 60 * 1000,
            cacheTime: 10 * 60 * 1000,
        }
    );
    console.log('search data', searchData?.data?.data)
    const isLoading = hasSearchQuery ? isLoadingSearch : isLoadingInfinite;
    const allProducts: IProduct[] = hasSearchQuery
        ? (Array.isArray(searchData?.data?.data) ? searchData.data.data : [])
        : (infiniteData?.pages?.flatMap((page) => page.data?.data?.products) || []);

    const filteredProducts = allProducts?.filter((product: IProduct) => {
        if (activeTab === 'all') return true;
        if (activeTab === 'course') return !product.pages;
        if (activeTab === 'ebook') return product.pages;
        return true;
    });

    const tabCounts = {
        all: allProducts?.length || 0,
        course: allProducts?.filter(p => !p.pages)?.length || 0,
        ebook: allProducts?.filter(p => p.pages)?.length || 0,
    };

    const tabs: TabOption[] = [
        { key: 'all', label: 'All Products', count: tabCounts.all },
        { key: 'course', label: 'Courses', count: tabCounts.course },
        { key: 'ebook', label: 'E-books', count: tabCounts.ebook },
    ];

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (context?.setSearchQuery) {
            context.setSearchQuery(e.target.value);
        }
    };

    const handleProductView = (product: IProduct) => {
        setSelectedProduct(product);
        setIsProductModalOpen(true);
    };

    const handleLoadMore = () => {
        if (hasNextPage && !isFetchingNextPage && !hasSearchQuery) {
            fetchNextPage();
        }
    };

    const handleTabChange = (tabKey: ProductType) => {
        setActiveTab(tabKey);
    };



    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-black dark:to-gray-800 p-4">
            <div className="max-w-7xl mx-auto">
                <div className="mt-20">
                    {/* Search Input */}
                    <div className="w-full flex justify-center mb-6">
                        <input
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="w-full max-w-md py-3 px-4 outline-none rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:border-[#FFC300] focus:ring-1 focus:ring-[#FFC300] transition-colors"
                            placeholder="Search for products, courses, e-books..."
                        />
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex items-center justify-center">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-1 shadow-md border border-gray-200 dark:border-gray-700">
                            <div className="flex space-x-3">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.key}
                                        onClick={() => handleTabChange(tab.key)}
                                        className={`
                                            relative px-4 py-1 rounded-lg font-medium text-sm max-[650px]:text-xs transition-all duration-200 ease-in-out
                                            ${activeTab === tab.key
                                                ? 'bg-[#FFC300] text-black shadow-md'
                                                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }
                                        `}
                                    >
                                        <span className="flex items-center gap-1">
                                            {tab.label}
                                            {tab.count !== undefined && (
                                                <span className={`
                                                    px-2 py-1 rounded-full text-[10px] font-semibold
                                                    ${activeTab === tab.key
                                                        ? 'bg-black bg-opacity-20 text-black'
                                                        : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                                                    }
                                                `}>
                                                    {tab.count}
                                                </span>
                                            )}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search Results Indicator */}
                {hasSearchQuery && (
                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Searching for: <span className="font-semibold">"{debouncedSearchQuery}"</span>
                            <button
                                onClick={clearSearch}
                                className="ml-2 text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                            >
                                Clear
                            </button>
                        </p>
                    </div>
                )}

                {/* Products Display */}
                {isLoading ? (
                    <ProductSkeleton />
                ) : searchError ? (
                    <div className="text-center py-20">
                        <p className="text-xl text-red-500">
                            Error searching products. Please try again.
                        </p>
                    </div>
                ) : filteredProducts?.length !== 0 ? (
                    <>
                        {/* Product Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-8">
                            {filteredProducts.map((product: IProduct) => (
                                <div key={product._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 transition-all hover:shadow-lg group">
                                    <div className="relative">
                                        <img
                                            src={product.productImage}
                                            alt={product.productName}
                                            className="w-full object-cover aspect-square filter brightness-225 contrast-110 transition-all duration-500 ease-in-out"
                                        />
                                        <div
                                            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                            onClick={() => handleProductView(product)}
                                        >
                                            <IoEyeOutline size={30} className="text-white" />
                                        </div>
                                    </div>
                                    <div className="p-1.5">
                                        <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2 truncate">{product.productName}</h3>
                                        <div className="flex items-center justify-between">
                                            <div className="flex gap-2 items-end">
                                                <span className="text-sm text-gray-400 line-through">₦{product.productPrice}</span>
                                                <span className="text-base font-medium text-gray-900 dark:text-gray-100">₦{product.paymentPrice}</span>
                                            </div>
                                            <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                                                {product.pages ? 'E-book' : 'Course'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {hasSearchQuery ? (
                            <div className="flex flex-col items-center py-8 gap-4">
                                <div className="text-center">
                                    <p className="text-lg text-gray-500 dark:text-gray-400">
                                        Found {filteredProducts.length} {activeTab === 'all' ? 'products' : activeTab === 'course' ? 'courses' : 'e-books'}
                                    </p>
                                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                                        for "{debouncedSearchQuery}"
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex md:hidden flex-col items-center py-8 gap-4">
                                    {hasNextPage && (
                                        <button
                                            onClick={handleLoadMore}
                                            disabled={isFetchingNextPage}
                                            className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#FFC300] hover:bg-[#E6AF00] disabled:bg-gray-300 disabled:cursor-not-allowed text-black font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
                                        >
                                            {isFetchingNextPage ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                                    Loading...
                                                </>
                                            ) : (
                                                <>
                                                    <FiChevronDown className="w-4 h-4 " />
                                                    Load More
                                                </>
                                            )}
                                        </button>
                                    )}

                                    {!hasNextPage && filteredProducts.length > 0 && (
                                        <div className="text-center">
                                            <p className="text-lg text-gray-500 dark:text-gray-400">
                                                🎉 You've seen all {activeTab === 'all' ? 'products' : activeTab === 'course' ? 'courses' : 'e-books'}!
                                            </p>
                                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                                                Total: {filteredProducts.length} {activeTab === 'all' ? 'products' : activeTab === 'course' ? 'courses' : 'e-books'}
                                            </p>
                                        </div>
                                    )}
                                </div>


                            </>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-xl text-gray-500 dark:text-gray-400">
                            No {activeTab === 'all' ? 'products' : activeTab === 'course' ? 'courses' : 'e-books'} found
                        </p>
                        {searchQuery && (
                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                                Try adjusting your search term: "{searchQuery}"
                            </p>
                        )}
                        {activeTab !== 'all' && (
                            <button
                                onClick={() => setActiveTab('all')}
                                className="mt-4 px-4 py-2 bg-[#FFC300] text-black rounded-lg hover:bg-[#E6AF00] transition-colors"
                            >
                                View All Products
                            </button>
                        )}
                    </div>
                )}
            </div>

            {isProductModalOpen && selectedProduct && (
                <Modal onClose={() => setIsProductModalOpen(false)}>
                    <div className="flex w-full gap-2 max-[650px]:flex-col max-[650px]:w-full overflow-auto no-scrollbar">
                        <span className="w-[50%] flex items-center justify-center max-[650px]:w-full">
                            <img src={selectedProduct.productImage} alt={selectedProduct.productName} className="object-cover w-full aspect-square" />
                        </span>
                        <div className="w-[50%] flex flex-col gap-2 max-[650px]:w-full mt-[20px]">
                            <div className="w-full h-[20%] gap-2 flex flex-col justify-end max-[650px]:h-auto">
                                <h2 className="text-[14px] mb-1 pb-2 flex items-center border-b border-lightgrey">
                                    {selectedProduct.pages ? <p>E-book</p> : <p>Course</p>}
                                </h2>
                                <h2 className="text-[20px] w-full max-[650px]:text-[15px]">{selectedProduct?.productName}</h2>
                            </div>
                            <div className="prose h-[30%] max-[650px]:w-full max-[650px]:text-[12px] text-[#000000c1] dark:text-white text-[14px]" dangerouslySetInnerHTML={{ __html: selectedProduct?.productDescription?.slice(0, 80) }} />
                            {selectedProduct.pages ? (
                                <div className="h-[50%] max-[650px]:mt-[20px] max-[650px]:text-[14px] max-[650px]:h-auto flex flex-col gap-3 justify-center max-[650px]:w-full">
                                    <p>E-book Details</p>
                                    <span className="flex items-center gap-2">
                                        <RiPagesLine />
                                        <p>Pages: {selectedProduct?.pages}</p>
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <IoMdTime />
                                        <p>Duration: {selectedProduct?.duration}</p>
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <FiUser />
                                        <p>Author: {selectedProduct?.author}</p>
                                    </span>
                                </div>
                            ) : (
                                <div className="h-[50%] max-[650px]:h-auto gap-2 flex flex-col justify-center max-[650px]:w-full">
                                    <p>Course Details</p>
                                    <span className="flex items-center gap-2">
                                        <IoMdTime />
                                        <p>Duration: {selectedProduct?.duration}</p>
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <FiUser />
                                        <p>Author: {selectedProduct?.author}</p>
                                    </span>
                                </div>
                            )}
                            <div className="flex w-full items-center justify-between mt-4">
                                <span className="flex gap-2 items-center">
                                    <CiMoneyCheck1 />
                                    <p>Amount: {selectedProduct?.paymentPrice}</p>
                                </span>
                                <button
                                    className="bg-[#FFC300] text-black w-[120px] text-[12px] h-[30px] rounded"
                                    onClick={() => navigate(`/details/${selectedProduct._id}`)}
                                >
                                    View more
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Search;