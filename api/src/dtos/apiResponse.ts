class ApiResponse {
    statusCode: number;
    IsSuccess: boolean;
    message: string;
    data: any;

    constructor(statusCode: number, IsSuccess: boolean, message: string, data: any) {
        this.statusCode = statusCode;
        this.IsSuccess = IsSuccess;
        this.message = message;
        this.data = data;
    }
}

export default ApiResponse;
