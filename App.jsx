import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import ScientistProfile from './pages/ScientistProfile';




function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/AdminDashboard" element={<AdminDashboard />} />
      <Route path="/scientist/:id" element={<ScientistProfile />} />

      
    </Routes>
  );
}

export default App;
