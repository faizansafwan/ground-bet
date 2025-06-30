import { useState } from 'react'
import './App.css'
import Dashboard from './pages/dashboard'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Dashboard />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  )
}

export default App
