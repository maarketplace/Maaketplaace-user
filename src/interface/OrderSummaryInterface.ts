
export interface IOrderSummary {
    _id: string;
    user_id: {
        _id: string;
        fullName: string;
        email: string;
        phoneNumber: string;
        createdAt: string;
        updatedAt: string;
    };
    // merchant_id: {
    //     _id: string;
    //     fullName: string;
    //     email: string;
    //     business_name: string;
    //     phoneNumber: string;
    //     bio: string;
    //     profession: string;
    //     image: string;
    //     imageCloudUrl: string;
    //     subscribed: boolean;
    //     subscriptionType: string;
    //     createdAt: string;
    //     updatedAt: string;
    //     accountStatus: string;
    // };
    products: {
        _id: string;
        productName: string;
        productDescription: string;
        productPrice: number;
        paymentPrice: number;
        discountPrice: number;
        productImage: string;
        productImageUrl: string;
        imageGallery: string[];
        imageGalleryUrl: string[];
        quantity: number;
        productLocation: string;
        createdAt: string;
        updatedAt: string;
        productType: string;
        courseUrl: string;
        
    }[];
    amount: number;
    status: string;
    transaction_fee: number;
    payable_amount: number;
    createdAt: string;
    updatedAt: string;
}
