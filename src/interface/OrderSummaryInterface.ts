/* eslint-disable @typescript-eslint/no-explicit-any */
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
    merchant_id: {
        _id: string;
        fullName: string;
        email: string;
        business_name: string;
        phoneNumber: string;
        bio: string;
        profession: string;
        image: string;
        imageCloudUrl: string;
        subscribed: boolean;
        subscriptionType: string;
        products: string[];
        createdAt: string;
        updatedAt: string;
        accountStatus: string;
        customers: any[];
        account_status: string;
    };
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
        productLocation?: string; // Optional for courses
        createdAt: string;
        updatedAt: string;
        productType: 'ebook' | 'course' | 'ticket';
        courseUrl?: string; // Optional for courses
        // Ebook specific fields
        eBook?: string;
        pages?: number;
        eBookUrl?: string;
        subCategory?: string;
    }[];
    amount: number;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    transaction_fee: number;
    payable_amount: number;
    createdAt: string;
    updatedAt: string;
    // Ticket specific fields - only present for ticket purchases
    referenceId?: {
        _id: string;
        eventId: {
            _id: string;
            name: string;
            startDate: string;
            endDate: string;
            location: string;
            bannerImage: string;
            totalTickets: number;
            ticketsSold: number;
            price: string;
            remainingTickets: number;
            id: string;
        };
        attendees: string[];
        amount: number;
        status: 'pending' | 'processing' | 'completed' | 'failed';
    };
}