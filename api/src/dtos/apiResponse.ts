class ApiResponse {
    statusCode: number;
    success: boolean;
    message: string;
    data: any;

    constructor(statusCode: number, success: boolean, message: string, data: any) {
        this.statusCode = statusCode;
        this.success = success;
        this.message = message;
        this.data = data;
    }
}

export default ApiResponse;
