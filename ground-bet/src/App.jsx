import { useEffect, useState } from 'react'
import './App.css'
import Dashboard from './pages/dashboard'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Dashboards from './pages/sample';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import typing from '../src/assets/typing.mp3';
import Admin from './pages/Admin';

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const handleKeyPress = (e) => {
      const target = e.target;
      if (["INPUT", "TEXTAREA"].includes(target.tagName)) {
        const audio = new Audio(typing);
        audio.volume = 0.2; // softer sound
        audio.play().catch(() => {});
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/ground-bet" element={<Dashboard />}/>
        <Route path="/ground-bet/sample" element={<Dashboards />} />
        <Route path="/ground-bet/admin" element={<Admin />}/>
      </Routes> 
      
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </Router>
  )
}

export default App
