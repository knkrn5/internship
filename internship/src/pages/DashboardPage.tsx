import React, { useState } from "react";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import RightSidebar from "../components/layout/RightSidebar";
import Feed from "../components/feed/Feed";
import axios from "axios";
import { useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const DashboardPage: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const getUserData = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/user-data`, {
        withCredentials: true,
      });
      console.log(response.data);
      if (response.data.IsSuccess) {
        setIsLoggedIn(true);
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
      <Header isLoggedIn={isLoggedIn} />

      {/* Main Layout */}
      <div className="flex">
        {/* Left Sidebar */}
        <Sidebar isLoggedIn={isLoggedIn} />

        {/* Main Content */}
        <Feed isLoggedIn={isLoggedIn} />

        {/* Right Sidebar */}
        <RightSidebar isLoggedIn={isLoggedIn} />
      </div>
    </div>
  );
};

export default DashboardPage;
