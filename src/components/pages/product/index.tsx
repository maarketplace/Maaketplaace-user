import { useContext, useEffect, useState } from 'react';
import { useInfiniteQuery, useQuery } from 'react-query';
import { getAllProduct, searchByQuery, searchProduct } from '../../../api/query';
import { SearchContext } from '../../../context/Search';
import { IProduct } from '../../../interface/ProductInterface';
import ProductSkeleton from '../../../loader/productSkeleton';
import ProductGrid from './ProductList';
import { CiMoneyCheck1 } from 'react-icons/ci';
import { FiUser } from 'react-icons/fi';
import { IoMdTime } from 'react-icons/io';
import { RiPagesLine } from 'react-icons/ri';
import { FiChevronDown, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Modal from '../../../utils/ProductModal';

type ProductType = 'all' | 'course' | 'ebook' | 'ticket';

interface TabOption {
    key: ProductType;
    label: string;
    count?: number;
}

interface FilterParams {
    productType?: string;
    category?: string;
    subCategory?: string;
    minPrice?: number;
    maxPrice?: number;
}

function Product() {
    const context = useContext(SearchContext);
    const navigate = useNavigate();
    const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<ProductType>('all');
    const [filterParams, setFilterParams] = useState<FilterParams>({});
    const LIMIT = 8;

    const { debouncedSearchQuery = '', isSearching = false, clearSearch = () => { } } = context || {};
    const hasSearchQuery = isSearching;
    const hasFilters = Object.keys(filterParams).some(key => filterParams[key as keyof FilterParams] !== undefined && filterParams[key as keyof FilterParams] !== '');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const buildQueryString = () => {
        const params = new URLSearchParams();

        if (activeTab === 'course') {
            params.append('productType', 'course');
        } else if (activeTab === 'ebook') {
            params.append('productType', 'ebook');
        }

        Object.entries(filterParams).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
                params.append(key, value.toString());
            }
        });

        return params.toString();
    };

    // Regular infinite query for all products (no search, no filters)
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
            enabled: !hasSearchQuery && !hasFilters,
        }
    );

    // Backend filtering query
    const {
        data: filteredData,
        isLoading: isLoadingFiltered,
        error: filteredError,
    } = useQuery(
        ['searchByQuery', buildQueryString()],
        () => searchByQuery(buildQueryString()),
        {
            enabled: hasFilters && !hasSearchQuery,
            staleTime: 2 * 60 * 1000,
            cacheTime: 10 * 60 * 1000,
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
            enabled: hasSearchQuery && !!debouncedSearchQuery.trim(),
            staleTime: 2 * 60 * 1000,
            cacheTime: 10 * 60 * 1000,
        }
    );

    const isLoading = hasSearchQuery ? isLoadingSearch : hasFilters ? isLoadingFiltered : isLoadingInfinite;
    const error = hasSearchQuery ? searchError : hasFilters ? filteredError : null;

    let allProducts: IProduct[] = [];
    if (hasSearchQuery) {
        allProducts = searchData?.data?.data?.data?.data || [];
    } else if (hasFilters) {
        allProducts = filteredData?.data?.data || [];
    } else {
        allProducts = infiniteData?.pages?.flatMap((page) => page.data?.data?.products) || [];
    }

    const filteredProducts = hasFilters ? allProducts : allProducts?.filter((product: IProduct) => {
        if (activeTab === 'all') return true;
        if (activeTab === 'course') return !product.pages;
        if (activeTab === 'ebook') return product.pages;
        return true;
    });

    const tabCounts = {
        all: allProducts?.length || 0,
        course: allProducts?.filter(p => !p.pages)?.length || 0,
        ebook: allProducts?.filter(p => p.pages)?.length || 0,
        ticket: null,
    };

    const tabs: TabOption[] = [
        { key: 'all', label: 'All Products', count: tabCounts.all },
        { key: 'course', label: 'Courses', count: tabCounts.course },
        { key: 'ebook', label: 'E-books', count: tabCounts.ebook },
        { key: 'ticket', label: 'Tickets' },
    ];

    const handleProductView = (product: IProduct) => {
        setSelectedProduct(product);
        setIsProductModalOpen(true);
    };

    const handleLoadMore = () => {
        if (hasNextPage && !isFetchingNextPage && !hasSearchQuery && !hasFilters) {
            fetchNextPage();
        }
    };

    const handleTabChange = (tabKey: ProductType) => {
        if (tabKey === 'ticket') {
            navigate('/events');
            return;
        }

        setActiveTab(tabKey);
        if (hasFilters) {
            setFilterParams({});
        }
    };

    const clearAllFilters = () => {
        setFilterParams({});
        setActiveTab('all');
    };

    const totalPages = infiniteData?.pages?.length || 0;
    const currentPage = totalPages;

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);

            if (currentPage > 3) {
                pages.push('...');
            }

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                if (!pages.includes(i)) {
                    pages.push(i);
                }
            }

            if (currentPage < totalPages - 2) {
                pages.push('...');
            }

            if (totalPages > 1) {
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const handlePageClick = (pageNumber: number) => {
        const pagesToFetch = pageNumber - totalPages;
        if (pagesToFetch > 0) {
            for (let i = 0; i < pagesToFetch; i++) {
                if (hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-black dark:to-gray-800 p-4">
            <div className="max-w-7xl mx-auto">
                <div className="mt-20">
                    <div className="flex items-center justify-center mb-4 w-full">
                        <div className="bg-white dark:bg-black  p-1 shadow-md rounded-lg dark:border-gray-700 w-full md:w-[60%]">
                            <div className="flex items-center justify-between px-2 py-1 overflow-x-scroll no-scrollbar w-full">
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
                                        <span className="flex items-center gap-1 w-[100px] md:w-[150px] justify-center">
                                            {tab.label}
                                            {tab.count !== undefined && (
                                                <span className={`
                                                    w-5 h-5 rounded-full text-[10px] font-semibold flex items-center justify-center
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

                {hasFilters && !hasSearchQuery && (
                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Showing filtered results
                            <button
                                onClick={clearAllFilters}
                                className="ml-2 text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                            >
                                Clear Filters
                            </button>
                        </p>
                    </div>
                )}

                {isLoading ? (
                    <ProductSkeleton />
                ) : error ? (
                    <div className="text-center py-20">
                        <p className="text-xl text-red-500">
                            {hasSearchQuery ? 'Error searching products.' : 'Error loading products.'} Please try again.
                        </p>
                    </div>
                ) : filteredProducts?.length !== 0 ? (
                    <>
                        <ProductGrid
                            products={filteredProducts}
                            onProductView={handleProductView}
                        />

                        {/* Show different pagination based on mode */}
                        {hasSearchQuery || hasFilters ? (
                            // Search/Filter mode: Show simple results count
                            <div className="flex flex-col items-center py-8 gap-4">
                                <div className="text-center">
                                    <p className="text-lg text-gray-500 dark:text-gray-400">
                                        Found {filteredProducts.length} {activeTab === 'all' ? 'products' : activeTab === 'course' ? 'courses' : 'e-books'}
                                    </p>
                                    {hasSearchQuery && (
                                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                                            for "{debouncedSearchQuery}"
                                        </p>
                                    )}
                                    {hasFilters && !hasSearchQuery && (
                                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                                            with applied filters
                                        </p>
                                    )}
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
                                                    <FiChevronDown className="w-4 h-4" />
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

                                <div className="hidden md:flex flex-col items-center py-8 gap-4">
                                    {totalPages > 0 && (
                                        <div className="flex items-center gap-2">
                                            <button
                                                disabled={currentPage === 1}
                                                className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                            >
                                                <FiChevronLeft className="w-4 h-4" />
                                                Previous
                                            </button>

                                            <div className="flex items-center gap-1">
                                                {getPageNumbers().map((page, index) => {
                                                    if (page === '...') {
                                                        return (
                                                            <span
                                                                key={`ellipsis-${index}`}
                                                                className="px-3 py-2 text-gray-500 dark:text-gray-400"
                                                            >
                                                                ...
                                                            </span>
                                                        );
                                                    }

                                                    const pageNumber = page as number;
                                                    const isActive = pageNumber === currentPage;

                                                    return (
                                                        <button
                                                            key={pageNumber}
                                                            onClick={() => handlePageClick(pageNumber)}
                                                            disabled={pageNumber > currentPage && !hasNextPage}
                                                            className={`px-3 py-2 rounded-lg transition-colors duration-200 ${isActive
                                                                ? 'bg-[#FFC300] text-black font-medium'
                                                                : 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed'
                                                                }`}
                                                        >
                                                            {pageNumber}
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            <button
                                                onClick={handleLoadMore}
                                                disabled={!hasNextPage || isFetchingNextPage}
                                                className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                            >
                                                {isFetchingNextPage ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                                        Loading...
                                                    </>
                                                ) : (
                                                    <>
                                                        Next
                                                        <FiChevronRight className="w-4 h-4" />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    )}

                                    <div className="text-center">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Showing {filteredProducts.length} {activeTab === 'all' ? 'products' : activeTab === 'course' ? 'courses' : 'e-books'}
                                            {totalPages > 0 && ` • Page ${currentPage} of ${totalPages}`}
                                            {!hasNextPage && totalPages > 0 && " • All pages loaded"}
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-xl text-gray-500 dark:text-gray-400">
                            No {activeTab === 'all' ? 'products' : activeTab === 'course' ? 'courses' : 'e-books'} found
                        </p>
                        {hasSearchQuery && (
                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                                Try adjusting your search term: "{debouncedSearchQuery}"
                            </p>
                        )}
                        {hasFilters && !hasSearchQuery && (
                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                                Try adjusting your filters
                            </p>
                        )}
                        {(activeTab !== 'all' || hasFilters) && (
                            <button
                                onClick={() => {
                                    setActiveTab('all');
                                    setFilterParams({});
                                }}
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
}

export default Product;
