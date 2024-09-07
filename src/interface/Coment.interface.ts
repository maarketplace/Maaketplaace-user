export interface IAddComment {
    user_likes: any;
    total_likes: number;
    user: {
        fullName:  string
    };
    _id: string;
    id: number
    productIdParam: string | undefined;
    comment: string;
    createdTime: string
}