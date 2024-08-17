export interface ImgUrl {
    url: string;
    isLiked: boolean;
    comments: Comment[];
}
// type productId = number;
export interface IProduct {
    paymentPrice: number;
    user_likes: string[];
    _id: string;
    productDescription: any;
    productImage: string | undefined;
    id: number;
    productName: string;
    image: string;
    productAuthorName: string;
    isLiked: boolean;
    commentText: string;
    comments: (string | Comment)[];
    img: string;
    imgUrl: ImgUrl[];
    description: string;
    postedTime?:  string;
    total_likes: number;
    merchant_likes: string[];
    productPrice: number;
    discountPrice: number;
    merchant: {
        business_name: string;
        _id: string;
        fullName: string;
        email: string;
        phoneNumber: string,
        bio: string;
        image: string;
        imageCloudUrl: string;
        verified: boolean;
        verificationCode: number;
        subscribed: boolean,
        subscriptionType: string;
        products: [],
        createdAt: string;
        updatedAt: string;
    },
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