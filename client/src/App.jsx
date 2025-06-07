import { Routes, Route, useLocation } from 'react-router-dom' 
import Login2 from './pages/Login2';
import Signup from './pages/Signup';
import { AnimatePresence } from 'framer-motion';
import InternshipTable from './pages/MainTable';

function App() {
  const location = useLocation();
  return (
     <AnimatePresence mode="wait">
       <Routes location ={location} key={location.pathname}>
         <Route path="/" element={<Login2 />} />
         <Route path="/signup" element={<Signup />} />
         <Route path="/dashboard" element={<InternshipTable />} />
       </Routes>
     </AnimatePresence>
  );
}
export default App;
