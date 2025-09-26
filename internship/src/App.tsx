import { useState } from 'react';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import RightSidebar from './components/layout/RightSidebar';
import Feed from './components/feed/Feed';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';

import './index.css';

function App() {
  const [isLoggedIn] = useState(true); 
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const handleShowLogin = () => {
    setAuthMode('login');
    setShowAuth(true);
  };

  const handleCloseAuth = () => {
    setShowAuth(false);
  };

  const handleSwitchToSignup = () => {
    setAuthMode('signup');
  };

  const handleSwitchToLogin = () => {
    setAuthMode('login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header onShowLogin={handleShowLogin} isLoggedIn={isLoggedIn} />
      
      {/* Main Layout */}
      <div className="flex">
        {/* Left Sidebar */}
        <Sidebar isLoggedIn={isLoggedIn} />
        
        {/* Main Content */}
        <Feed isLoggedIn={isLoggedIn} />
        
        {/* Right Sidebar */}
        <RightSidebar isLoggedIn={isLoggedIn} />
      </div>

      {/* Auth Modals */}
      {showAuth && authMode === 'login' && (
        <Login
          onSwitchToSignup={handleSwitchToSignup}
          onClose={handleCloseAuth}
        />
      )}
      
      {showAuth && authMode === 'signup' && (
        <Signup
          onSwitchToLogin={handleSwitchToLogin}
          onClose={handleCloseAuth}
        />
      )}
    </div>
  );
}

export default App;
