
export interface IOrder {
    transaction_fee: number;
    payable_amount: number;
    _id: string;
    user_id: string;
    merchant_id: string;
    products: string[];
    amount: number;
    status: string;
    country: string;
    state: string;
    homeAddress: string;
    createdAt: string;
    updatedAt: string;
  }

