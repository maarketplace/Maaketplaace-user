import toast from "react-hot-toast";

export const handleLikeClick = async (productId: string, allProduct: any[], loggedInUserId: string, isUserAuthenticated: boolean, mutate: any, navigate: any, setAllProduct: any) => {
    if (isUserAuthenticated) {
        const updateLikeProduct = [...allProduct];
        const existingItem = updateLikeProduct.findIndex((product: { _id: string; }) => product._id === productId);
        if (existingItem !== -1 && !updateLikeProduct[existingItem]?.user_likes?.includes(loggedInUserId)) {
            updateLikeProduct[existingItem].total_likes += 1;
            updateLikeProduct[existingItem]?.user_likes?.push(loggedInUserId);
            mutate(productId);
        } else if (existingItem !== -1 && updateLikeProduct[existingItem]?.user_likes?.includes(loggedInUserId)) {
            updateLikeProduct[existingItem].total_likes -= 1;
            updateLikeProduct[existingItem]?.user_likes?.pop(loggedInUserId);
            mutate(productId);
        }
        setAllProduct(updateLikeProduct);
    } else {
        toast.error("Please login to like this Product");
        setTimeout(() => {
            navigate('/');
        }, 2000);
    }
};

export const handleCartAddingAuth = (id: string, isUserAuthenticated: boolean, setLoadingStates: any, buyMutate: any, setPaymentDetails: any, setIsModalOpen: any, navigate: any) => {
    if (isUserAuthenticated) {
        setLoadingStates((prevState: any) => ({
            ...prevState,
            [id]: true,
        }));

        buyMutate(id, {
            onSuccess: (response: any) => {
                const paymentAmount = response?.data?.data?.data?.amount || '₦0';
                const paymentFee = response?.data?.data?.data?.transaction_fee || '₦0';
                const paymentID = response?.data?.data?.data?._id;
                const paymentAPI = response?.data?.data?.paymentData?.payment_type;

                setPaymentDetails({
                    amount: paymentAmount,
                    fee: paymentFee,
                    paymentID: paymentID,
                    paymentAPI: paymentAPI,
                    payeeName: '',
                    payeeEmail: '',
                    checkoutURL: '',
                    source: 'buyNow',
                });

                setTimeout(() => {
                    setIsModalOpen(true);
                }, 2000);

                setLoadingStates((prevState: any) => ({
                    ...prevState,
                    [id]: false,
                }));
            },
            onError: (error: any) => {
                console.log('Error:', error);
                setLoadingStates((prevState: any) => ({
                    ...prevState,
                    [id]: false,
                }));
            },
        });
    } else {
        navigate('/');
    }
};

export const handleEyeClick = (
    product: any,
    setIsProductModalOpen: (open: boolean) => void,
    setModalContent: (content: any) => void
  ) => {
    // Set the modal content to the selected product details
    setModalContent(product);
    
    // Open the modal
    setIsProductModalOpen(true);
  };
