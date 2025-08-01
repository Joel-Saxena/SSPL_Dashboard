import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import HomePage from './components/HomePage';
import AdminDashboard from './components/AdminDashboard';
// import ScientistProfile from './components/ScientistProfile';
import ProfileTabs from './components/ProfileTabs';
import SupervisorDashboard from './components/SupervisorDashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Home />} />
      <Route path="/SupervisorDashboard" element={<SupervisorDashboard />} />
      <Route path="/AdminDashboard" element={<AdminDashboard />} />
      {/* <Route path="/scientist/:id" element={<ScientistProfile />} /> */}
      <Route path="/profile" element={<ProfileTabs />} />
    </Routes>
  );
}

export default App;
