import { Routes, Route } from 'react-router-dom';
import { DashboardPage, LoginPage, SignupPage } from './pages';
import './index.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
    </Routes>
  );
}

export default App;
