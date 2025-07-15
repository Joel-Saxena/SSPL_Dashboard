import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import AdminDashboard from './components/AdminDashboard';
import ScientistProfile from './components/ScientistProfile';
import ProfileTabs from './components/ProfileTabs';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/AdminDashboard" element={<AdminDashboard />} />
      <Route path="/scientist/:id" element={<ScientistProfile />} />
      <Route path="/profile" element={<ProfileTabs />} />
    </Routes>
  );
}

export default App;
