import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// export function testapi() {
//     axios.get(`${API_URL}/health`)
//         .then(response => {
//             console.log(response.data);
//         })
//         .catch(error => {
//             console.error('Error fetching data:', error);
//         });
// }

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