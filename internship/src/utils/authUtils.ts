import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;


export const verifyEmail = async (email: string) => {
    try {
        const response = await axios.post(`${API_URL}/auth/verify-email`, {
            email,
        });
        return response.data;
    } catch (error) {
        if (error instanceof axios.AxiosError && error.response) {
            return error.response.data;
        }
        console.error('Error verifying email:', error);
        throw error;
    }
};

export const sendEmailOtp = async (email: string, reason: string) => {
    try {
        const response = await axios.post(`${API_URL}/auth/send-email-otp`, {
            email,
            reason,
        });
        return response.data;
    } catch (error) {
        if (error instanceof axios.AxiosError && error.response) {
            return error.response.data;
        }
        console.error('Error sending email OTP:', error);
        throw error;
    }
};

export const verifyEmailOtp = async (email: string, enteredOtp: string) => {
    try {
        const response = await axios.post(`${API_URL}/auth/verify-email-otp`, {
            email,
            enteredOtp,
        });
        return response.data;
    } catch (error) {
        if (error instanceof axios.AxiosError && error.response) {
            return error.response.data;
        }
        console.error('Error verifying email OTP:', error);
        throw error;
    }
};