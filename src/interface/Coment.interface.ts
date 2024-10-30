export interface IAddComment {
    image: string | null;
    user_likes: string[];
    total_likes: number;
    user: {
        fullName:  string
        _id: string
    };
    _id: string;
    id: number
    productIdParam: string | undefined;
    comment: string;
    createdTime: string
}