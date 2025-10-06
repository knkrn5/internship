import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import RightSidebar from '../components/layout/RightSidebar';
import Feed from '../components/feed/Feed';

const DashboardPage: React.FC = () => {
  const [isLoggedIn] = useState(false); 

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