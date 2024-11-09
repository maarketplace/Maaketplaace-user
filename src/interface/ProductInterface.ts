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
    products: IProduct[]; // Adjust the type if you have a specific product type
    createdAt: string;
    updatedAt: string;
    accountStatus: string;
    followedUsers: string[];
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
    user: string[];
    comments: string[];
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

export interface IQuicks {
    comments: string[];
    total_likes: number;
    user_likes: string[];
    _id: string;
    name: string;
    product_id: Product;
    description: string;
    merchant_id: Merchant;
    file: string;
    file_cloud_url: string;
    image_collections: string[];
    createdAt: string;
    updatedAt: string;
}

interface Product {
    _id: string;
    productName: string;
    productDescription: string;
    productPrice: number;
    paymentPrice: number;
    discountPrice: number;
    productImage: string;
    status: string;
    author: string;
    duration: string;
    topics: string;
    whatToExpect: string;
    productImageUrl: string;
    imageGallery: string[];
    imageGalleryUrl: string[];
    inStock: boolean;
    quantity: number;
    category: string;
    merchant: string;
    productLocation: string;
    comments: string[];
    user_likes: string[];
    merchant_likes: string[];
    total_likes: number;
    createdAt: string;
    updatedAt: string;
}

interface Merchant {
    _id: string;
    fullName: string;
    email: string;
    business_name: string;
    phoneNumber: string;
    is_admin: boolean;
    bio: string;
    profession: string;
    role_slug: string;
    accountStatus: string;
    image: string;
    imageCloudUrl: string;
    verified: boolean;
    subscribed: boolean;
    subscriptionType: string;
    products: string[];
    createdAt: string;
    updatedAt: string;
}
