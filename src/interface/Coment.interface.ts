export interface IAddComment {
    total_likes: number;
    user: string[];
    _id: string;
    id: number
    productIdParam: string | undefined;
    comment: string;
    createdTime: string
}