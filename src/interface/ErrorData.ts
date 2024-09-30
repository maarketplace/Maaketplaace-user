export interface IErrorResponse {
    message: string;
    response: {
        status: number;
        data: {
            error: {
                message: string
            };
            message: string;
        };
    };
}