import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import UserProfile from "../components/profile/UserProfile";
import axios from "axios";
import { Loader2 } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const ProfilePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const navigate = useNavigate();

  const getUserData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/auth/user-data`, {
        withCredentials: true,
      });

      if (response.data.IsSuccess) {
        setIsLoggedIn(true);
        setUserData(response.data.data);
      } else {
        // Not logged in, redirect to login
        navigate("/login");
      }
      return response.data;
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Redirect to login if there's an error
      navigate("/login");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    getUserData();
  }, [getUserData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header isLoggedIn={isLoggedIn} userData={userData} />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <UserProfile userData={userData} isLoggedIn={isLoggedIn} />
      </div>
    </div>
  );
};

export default ProfilePage;
