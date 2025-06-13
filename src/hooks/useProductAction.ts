import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';

import toast from 'react-hot-toast';
import { userLike, userBuyNow, userFollowMerchant } from '../api/mutation';
import { getCachedAuthData } from '../utils/auth.cache.utility';
import { IProduct } from '../interface/ProductInterface';
import { handleBuyNow } from '../utils/PaymentComponent';

interface PaymentDetails {
    amount: string;
    fee: string;
    paymentID: string;
    paymentAPI: string;
    payeeName: string;
    payeeEmail: string;
    checkoutURL: string;
    source: 'buyNow' | 'payNow';
}
export const useProductActions = (
    allProduct: IProduct[],
    setAllProduct: (products: IProduct[]) => void,
    loggedInUserId?: string,
    setPaymentDetails?: (details: PaymentDetails) => void,
    setIsModalOpen?: (open: boolean) => void,
    isUserAuthenticated?: boolean
) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
    const [followingMerchants, setFollowingMerchants] = useState<string[]>([]);

    const setItemLoading = (itemId: string, isLoading: boolean) => {
        setLoadingStates(prev => ({
            ...prev,
            [itemId]: isLoading
        }));
    };

    const { mutate: likeMutate } = useMutation(['userlike'], userLike, {
        onError: () => {
            toast.error("Failed to like product. Please try again.");
            queryClient.invalidateQueries(['getallproduct']);
        }
    });

    const { mutate: buyMutate } = useMutation(['buynow'], userBuyNow);

    const followMutation = useMutation(
        (merchantId: string) => userFollowMerchant(merchantId),
        {
            onMutate: async (merchantId: string) => {
                setItemLoading(`follow-${merchantId}`, true);

                await queryClient.cancelQueries(['getallproduct']);
                const previousFollowing = followingMerchants;
                setFollowingMerchants((prev) =>
                    prev.includes(merchantId)
                        ? prev.filter(id => id !== merchantId)
                        : [...prev, merchantId]
                );
                return { previousFollowing };
            },
            onSuccess: (_data, merchantId: string) => {
                toast.success("Now Following This Merchant!");
                setItemLoading(`follow-${merchantId}`, false);
                queryClient.invalidateQueries(['getallproduct']);
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onError: (_error, _merchantId: string, context: any) => {
                toast.error("An error occurred. Please try again.");
                if (context?.previousFollowing) {
                    setFollowingMerchants(context.previousFollowing);
                }
            },
        }
    );

    const handleLike = async (productId: string) => {
        const token = getCachedAuthData();
        if (token) {
            const updateLikeProduct = [...allProduct];
            const existingItem = updateLikeProduct.findIndex((product: { _id: string; }) => product._id === productId);

            if (existingItem !== -1 && !updateLikeProduct[existingItem]?.user_likes?.includes(loggedInUserId ?? '')) {
                updateLikeProduct[existingItem].total_likes += 1;
                updateLikeProduct[existingItem]?.user_likes?.push(loggedInUserId ?? '');
                likeMutate(productId);
            } else if (existingItem !== -1 && updateLikeProduct[existingItem]?.user_likes?.includes(loggedInUserId ?? '')) {
                updateLikeProduct[existingItem].total_likes -= 1;
                updateLikeProduct[existingItem].user_likes = updateLikeProduct[existingItem].user_likes.filter(id => id !== loggedInUserId);
                likeMutate(productId);
            }

            setAllProduct(updateLikeProduct);
        } else {
            toast.error("Please login to like this product");
            setTimeout(() => navigate('/login'), 2000);
        }
    };

    const handleFollow = (merchantId: string) => {
        const token = getCachedAuthData();
        if (token) {
            followMutation.mutate(merchantId);
        } else {
            toast.error("Please login to follow this merchant");
            setTimeout(() => navigate('/login'), 2000);
        }
    };
    const handleBuyNowAction = (productId: string) => {
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
            const token = getCachedAuthData();
            if (token) {
                buyMutate(productId);
            } else {
                localStorage.setItem("redirectPath", location.pathname);
                toast.error('Please login to complete your purchase');
                setTimeout(() => navigate('/login'), 2000);
            }
        }
    };

    const isBuyLoading = (productId: string) => loadingStates[`buy-${productId}`] || false;
    const isFollowLoading = (merchantId: string) => loadingStates[`follow-${merchantId}`] || false;

    return {
        handleLike,
        handleFollow,
        handleBuyNow: handleBuyNowAction,
        loadingStates,
        followingMerchants,
        isBuyLoading,
        isFollowLoading,
        setItemLoading
    };
};