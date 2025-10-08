import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const useAuthCheck = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get(`${API_URL}/auth/user-data`, {
                    withCredentials: true,
                });
                if (response.data.IsSuccess) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error("Auth check failed:", error);
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, []);

    return isAuthenticated;
};
