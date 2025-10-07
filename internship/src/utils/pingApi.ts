import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export function pingApi() {
    axios.get(`${API_URL}/health`)
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}