export interface ImgUrl {
    url: string;
    isLiked: boolean;
    comments: Comment[];
}
// type productId = number;
export interface IMerchant {
    _id: string;
    fullName: string;
    email: string;
    business_name: string;
    password: string;
    phoneNumber: string;
    is_admin: boolean;
    bio: string;
    profession: string;
    role_slug: string;
    image: string;
    imageCloudUrl: string;
    verified: boolean;
    verificationCode: number;
    subscribed: boolean;
    subscriptionType: string;
    products: any[]; // Adjust the type if you have a specific product type
    createdAt: string;
    updatedAt: string;
    accountStatus: string;
}

export interface IProduct {
    _id: string;
    productName: string;
    productDescription: string;
    productPrice: number;
    paymentPrice: number;
    discountPrice: number;
    productImage: string;
    status: string;
    eBook: string;
    author: string;
    pages: number;
    duration: string;
    topics: string;
    whatToExpect: string;
    eBookUrl: string;
    productImageUrl: string;
    imageGallery: string[]; 
    imageGalleryUrl: string[];
    inStock: boolean;
    quantity: number;
    category: string;
    subCategory: string;
    merchant: IMerchant;
    user: any[]; // Adjust the type if you have a specific user type
    comments: any[]; // Adjust the type if you have a specific comment type
    user_likes: string[];
    merchant_likes: string[];
    total_likes: number;
    createdAt: string;
    updatedAt: string;
}


export interface ICart {
    productName: string;
    id: string;
    _id: string;
    user_id: string;
    product: [
        {
            paymentPrice: number;
            _id: string;
            productName: string;
            productPrice: number;
            discountPrice: number;
            productImage: string;
            imageGallery: string;
            imageGalleryUrl: string;
            inStock: boolean;
            quantity: number;
            createdAt: string;
            updatedAt: string;
        },
    ]
    processed: boolean;
    quantity: number;
    price: number;
    createdAt: string;
    updatedAt: string;
}