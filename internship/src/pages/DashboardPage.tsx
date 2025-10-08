import React, { useState, useEffect } from "react";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import RightSidebar from "../components/layout/RightSidebar";
import Feed from "../components/feed/Feed";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const DashboardPage: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const getUserData = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/user-data`, {
        withCredentials: true,
      });
      // console.log(response.data.data);
      if (response.data.IsSuccess) {
        setIsLoggedIn(true);
        setUserData(response.data.data);
      }
      return response.data;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header isLoggedIn={isLoggedIn} userData={userData} />

      {/* Main Layout */}
      <div className="flex">
        {/* Left Sidebar */}
        <Sidebar isLoggedIn={isLoggedIn} userName={userData.firstName} />

        {/* Main Content */}
        <Feed />

        {/* Right Sidebar */}
        <RightSidebar />
      </div>
    </div>
  );
};

export default DashboardPage;
