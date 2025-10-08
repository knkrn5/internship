import { Routes, Route } from 'react-router-dom';
import { DashboardPage, LoginPage, SignupPage } from './pages';
import ResetPassword from './pages/auth/resetPassword';
import './index.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  );
}

export default App;
