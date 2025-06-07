import { Routes, Route, useLocation } from 'react-router-dom' 
import Login from './pages/Login';
import Signup from './pages/Signup';
import { AnimatePresence } from 'framer-motion';

function App() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location ={location} key={location.pathname}>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </AnimatePresence>
  );
}
export default App;
