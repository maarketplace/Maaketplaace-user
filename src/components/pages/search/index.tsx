/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState, useCallback } from "react";
import { SearchContext } from "../../../context/Search";
import { useInfiniteQuery, useQuery } from "react-query";
import { getAllProduct, searchProduct, searchByQuery } from "../../../api/query";
import { IProduct } from "../../../interface/ProductInterface";
import { CiMoneyCheck1 } from "react-icons/ci";
import { FiUser, FiChevronDown } from "react-icons/fi";
import { IoMdTime } from "react-icons/io";
import { RiPagesLine } from "react-icons/ri";
import Modal from "../../../utils/ProductModal";
import { IoEyeOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import ProductSkeleton from "../../../loader/productSkeleton";

type ProductType = 'all' | 'course' | 'ebook' | 'ticket';

interface TabOption {
    key: ProductType;
    label: string;
}

interface FilterParams {
    productType?: string;
    category?: string;
    subCategory?: string;
    minPrice?: number;
    maxPrice?: number;
}

const Search = () => {
    const navigate = useNavigate();
    const context = useContext(SearchContext);
    const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<ProductType>('all');
    const [filterParams, setFilterParams] = useState<FilterParams>({});
    const LIMIT = 12;

    const {
        searchQuery = '',
        debouncedSearchQuery = '',
        isSearching = false,
        clearSearch = () => { }
    } = context || {};

    const hasSearchQueries = isSearching && !!debouncedSearchQuery;
    const hasFilter = Object.keys(filterParams).some(key => filterParams[key as keyof FilterParams] !== undefined && filterParams[key as keyof FilterParams] !== '');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const buildQueryParams = (page: number = 1) => {
        const params: Record<string, string> = {
            page: page.toString(),
            limit: LIMIT.toString(),
        };

        if (activeTab === 'course') {
            params.productType = 'course';
        } else if (activeTab === 'ebook') {
            params.productType = 'ebook';
        }

        Object.entries(filterParams).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
                params[key] = String(value);
            }
        });

        return params;
    };

    const {
        data: infiniteData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading: isLoadingInfinite,
        error: infiniteError
    } = useInfiniteQuery(
        ['getAllSearchableProducts', activeTab, filterParams],
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
            enabled: activeTab === 'all' && !hasFilter && !hasSearchQueries,
        }
    );

    const {
        data: filteredInfiniteData,
        fetchNextPage: fetchNextFilteredPage,
        hasNextPage: hasNextFilteredPage,
        isFetchingNextPage: isFetchingNextFilteredPage,
        isLoading: isLoadingFilteredInfinite,
        error: filteredInfiniteError,
    } = useInfiniteQuery(
        ['searchBySearchableQuery', activeTab, filterParams],
        ({ pageParam = 1 }) => searchByQuery(buildQueryParams(pageParam)),
        {
            getNextPageParam: (lastPage, allPages) => {
                const lastFetchedCount = lastPage?.data?.data?.length || 0;
                if (lastFetchedCount < LIMIT) return undefined;
                return allPages.length + 1;
            },
            enabled: (activeTab !== 'all' || hasFilter) && !hasSearchQueries,
            staleTime: 2 * 60 * 1000,
            cacheTime: 10 * 60 * 1000,
            refetchOnWindowFocus: false,
        }
    );

    const {
        data: searchData,
        isLoading: isLoadingSearch,
        error: searchError,
    } = useQuery(
        ['searchProducts', debouncedSearchQuery],
        () => searchProduct(1, 100, debouncedSearchQuery),
        {
            enabled: hasSearchQueries && !!debouncedSearchQuery,
            staleTime: 2 * 60 * 1000,
            cacheTime: 10 * 60 * 1000,
        }
    );

    const isLoading = hasSearchQueries
        ? isLoadingSearch
        : (activeTab !== 'all' || hasFilter)
            ? isLoadingFilteredInfinite
            : isLoadingInfinite;

    const currentError = hasSearchQueries
        ? searchError
        : (activeTab !== 'all' || hasFilter)
            ? filteredInfiniteError
            : infiniteError;

    let allProducts: IProduct[] = [];
    let loadMoreFn = useCallback(() => { }, []);
    let hasMore = false;
    let isLoadingMore = false;

    if (hasSearchQueries) {
        allProducts = Array.isArray(searchData?.data?.data) ? searchData.data.data : [];
    } else if (activeTab !== 'all' || hasFilter) {
        allProducts = filteredInfiniteData?.pages?.flatMap((page) => page.data?.data) || [];
        loadMoreFn = fetchNextFilteredPage;
        hasMore = !!hasNextFilteredPage;
        isLoadingMore = isFetchingNextFilteredPage;
    } else {
        allProducts = infiniteData?.pages?.flatMap((page) => page.data?.data?.products) || [];
        loadMoreFn = fetchNextPage;
        hasMore = !!hasNextPage;
        isLoadingMore = isFetchingNextPage;
    }

    const filteredProducts = (hasFilter || activeTab !== 'all') ? allProducts : allProducts?.filter((product: IProduct) => {
        if (activeTab === 'all') return true;
        if (activeTab === 'course') return !product.pages;
        if (activeTab === 'ebook') return product.pages;
        return true;
    });

    const tabs: TabOption[] = [
        { key: 'all', label: 'All Products' },
        { key: 'course', label: 'Courses' },
        { key: 'ebook', label: 'E-books' },
        { key: 'ticket', label: 'Tickets' },
    ];

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (context?.setSearchQuery) {
            context.setSearchQuery(e.target.value);
        }
    }, [context]);

    const handleProductView = useCallback((product: IProduct) => {
        setSelectedProduct(product);
        setIsProductModalOpen(true);
    }, []);

    const handleLoadMore = useCallback(() => {
        if (hasMore && !isLoadingMore && !hasSearchQueries) {
            loadMoreFn();
        }
    }, [hasMore, isLoadingMore, hasSearchQueries, loadMoreFn]);

    const handleTabChange = useCallback((tabKey: ProductType) => {
        if (tabKey === 'ticket') {
            navigate('/events');
            return;
        }
        setActiveTab(tabKey);
        if (hasFilter) {
            setFilterParams({});
        }
    }, [hasFilter, navigate]);

    const handleCloseModal = useCallback(() => {
        setIsProductModalOpen(false);
        setSelectedProduct(null);
    }, []);

    const handleViewMore = useCallback(() => {
        if (selectedProduct) {
            navigate(`/details/${selectedProduct._id}`);
            handleCloseModal();
        }
    }, [selectedProduct, navigate, handleCloseModal]);

    const handleClearSearch = useCallback(() => {
        clearSearch();
        setActiveTab('all');
        setFilterParams({});
    }, [clearSearch]);

    const clearAllFilters = useCallback(() => {
        setFilterParams({});
        setActiveTab('all');
    }, []);

    const buttonBaseClasses = "px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
    const primaryButtonClasses = `${buttonBaseClasses} bg-[#FFC300] text-black hover:bg-[#E6AF00] focus:ring-[#FFC300]`;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-black dark:to-gray-800 p-4">
            <div className="max-w-7xl mx-auto">
                <div className="mt-20">
                    <div className="w-full flex justify-center mb-6">
                        <input
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="w-full max-w-md py-3 px-4 outline-none rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:border-[#FFC300] focus:ring-1 focus:ring-[#FFC300] transition-colors"
                            placeholder="Search for products, courses, e-books..."
                            aria-label="Search products"
                        />
                    </div>

                    <div className="flex items-center justify-center">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-1 shadow-md border border-gray-200 dark:border-gray-700">
                            <div className="flex space-x-3" role="tablist" aria-label="Product type filter">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.key}
                                        onClick={() => handleTabChange(tab.key)}
                                        role="tab"
                                        aria-selected={activeTab === tab.key}
                                        aria-controls={`${tab.key}-panel`}
                                        className={`
                                            relative px-4 py-1 rounded-lg font-medium text-sm max-[650px]:text-xs transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#FFC300] focus:ring-offset-2
                                            ${activeTab === tab.key
                                                ? 'bg-[#FFC300] text-black shadow-md'
                                                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }
                                        `}
                                    >
                                        <span className="flex items-center gap-1">
                                            {tab.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {hasSearchQueries && (
                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Searching for: <span className="font-semibold">"{debouncedSearchQuery}"</span>
                            <button
                                onClick={handleClearSearch}
                                className="ml-2 text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
                                aria-label="Clear search"
                            >
                                Clear
                            </button>
                        </p>
                    </div>
                )}

                {hasFilter && !hasSearchQueries && (
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
                ) : currentError ? (
                    <div className="text-center py-20">
                        <p className="text-xl text-red-500" role="alert">
                            {(currentError as any)?.response?.data?.message || 'An error occurred while loading products'}
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className={`mt-4 ${primaryButtonClasses}`}
                        >
                            Try Again
                        </button>
                    </div>
                ) : filteredProducts?.length > 0 ? (
                    <>
                        <div
                            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-8"
                            role="grid"
                            aria-label={`${activeTab} products`}
                        >
                            {filteredProducts.map((product: IProduct) => (
                                <div
                                    key={product._id}
                                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 transition-all hover:shadow-lg group focus-within:ring-2 focus-within:ring-[#FFC300]"
                                    role="gridcell"
                                >
                                    <div className="relative">
                                        <img
                                            src={product.productImage }
                                            alt={product.productName}
                                            className="w-full object-cover aspect-square filter brightness-225 contrast-110 transition-all duration-500 ease-in-out"
                                            loading="lazy"
                                        />
                                        <button
                                            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer focus:opacity-100 focus:outline-none"
                                            onClick={() => handleProductView(product)}
                                            aria-label={`View details for ${product.productName}`}
                                        >
                                            <IoEyeOutline size={30} className="text-white" />
                                        </button>
                                    </div>
                                    <div className="p-1.5">
                                        <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2 truncate" title={product.productName}>
                                            {product.productName}
                                        </h3>
                                        <div className="flex items-center justify-between">
                                            <div className="flex gap-2 items-end">
                                                <span className="text-sm text-gray-400" aria-label="Original price">
                                                    ₦{product.productPrice?.toLocaleString()}
                                                </span>
                                               
                                            </div>
                                            <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                                                {product.pages ? 'E-book' : 'Course'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {hasSearchQueries ? (
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
                            <div className="flex md:hidden flex-col items-center py-8 gap-4">
                                {hasMore ? (
                                    <button
                                        onClick={handleLoadMore}
                                        disabled={isLoadingMore}
                                        className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#FFC300] hover:bg-[#E6AF00] disabled:bg-gray-300 disabled:cursor-not-allowed text-black font-medium transition-colors duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#FFC300] focus:ring-offset-2"
                                        aria-label={isLoadingMore ? "Loading more products" : "Load more products"}
                                    >
                                        {isLoadingMore ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" aria-hidden="true"></div>
                                                Loading...
                                            </>
                                        ) : (
                                            <>
                                                <FiChevronDown className="w-4 h-4" aria-hidden="true" />
                                                Load More
                                            </>
                                        )}
                                    </button>
                                ) : filteredProducts.length > 0 && (
                                    <div className="text-center">
                                        <p className="text-lg text-gray-500 dark:text-gray-400">
                                            🎉 You've seen all {activeTab === 'all' ? 'products' : activeTab === 'course' ? 'courses' : 'e-books'}!
                                        </p>
                                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                                            Total: {filteredProducts.length} {activeTab === 'all' ? 'products' : activeTab === 'course' ? 'courses' : 'e-books'}
                                            {hasFilter && ' with applied filters'}
                                        </p>
                                    </div>
                                )}
                            </div>
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
                        {hasFilter && !hasSearchQueries && (
                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                                Try adjusting your filters
                            </p>
                        )}
                        {(activeTab !== 'all' || hasFilter) && (
                            <button
                                onClick={() => {
                                    setActiveTab('all');
                                    setFilterParams({});
                                }}
                                className={`mt-4 ${primaryButtonClasses}`}
                            >
                                View All Products
                            </button>
                        )}
                    </div>
                )}
            </div>

            {isProductModalOpen && selectedProduct && (
                <Modal onClose={handleCloseModal}>
                    <div className="flex w-full gap-2 max-[650px]:flex-col max-[650px]:w-full overflow-auto no-scrollbar">
                        <div className="w-[50%] flex items-center justify-center max-[650px]:w-full">
                            <img
                                src={selectedProduct.productImage}
                                alt={selectedProduct.productName}
                                className="object-cover w-full aspect-square"
                            />
                        </div>
                        <div className="w-[50%] flex flex-col gap-2 max-[650px]:w-full mt-[20px]">
                            <div className="w-full h-[20%] gap-2 flex flex-col justify-end max-[650px]:h-auto">
                                <h2 className="text-[14px] mb-1 pb-2 flex items-center border-b border-lightgrey">
                                    {selectedProduct.pages ? <span>E-book</span> : <span>Course</span>}
                                </h2>
                                <h2 className="text-[20px] w-full max-[650px]:text-[15px]">
                                    {selectedProduct?.productName}
                                </h2>
                            </div>
                            <div
                                className="prose h-[30%] max-[650px]:w-full max-[650px]:text-[12px] text-[#000000c1] dark:text-white text-[14px]"
                                dangerouslySetInnerHTML={{
                                    __html: selectedProduct?.productDescription?.slice(0, 80) + (selectedProduct?.productDescription?.length > 80 ? '...' : '')
                                }}
                            />
                            {selectedProduct.pages ? (
                                <div className="h-[50%] max-[650px]:mt-[20px] max-[650px]:text-[14px] max-[650px]:h-auto flex flex-col gap-3 justify-center max-[650px]:w-full">
                                    <p className="font-semibold">E-book Details</p>
                                    <div className="flex items-center gap-2">
                                        <RiPagesLine aria-hidden="true" />
                                        <p>Pages: {selectedProduct?.pages}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <IoMdTime aria-hidden="true" />
                                        <p>Duration: {selectedProduct?.duration}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FiUser aria-hidden="true" />
                                        <p>Author: {selectedProduct?.author}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-[50%] max-[650px]:h-auto gap-2 flex flex-col justify-center max-[650px]:w-full">
                                    <p className="font-semibold">Course Details</p>
                                    <div className="flex items-center gap-2">
                                        <IoMdTime aria-hidden="true" />
                                        <p>Duration: {selectedProduct?.duration}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FiUser aria-hidden="true" />
                                        <p>Author: {selectedProduct?.author}</p>
                                    </div>
                                </div>
                            )}
                            <div className="flex w-full items-center justify-between mt-4">
                                <div className="flex gap-2 items-center">
                                    <CiMoneyCheck1 aria-hidden="true" />
                                    <p>Amount: ₦{selectedProduct?.paymentPrice?.toLocaleString()}</p>
                                </div>
                                <button
                                    className="bg-[#FFC300] text-black w-[120px] text-[12px] h-[30px] rounded hover:bg-[#E6AF00] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFC300] focus:ring-offset-2"
                                    onClick={handleViewMore}
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
