import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import AdminDashboard from './components/AdminDashboard';
import ScientistProfile from './components/ScientistProfile';




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
